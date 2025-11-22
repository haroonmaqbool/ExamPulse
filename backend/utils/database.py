"""
Database utilities
Handles Supabase connection and operations.
"""

from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()


class Database:
    """Supabase database client"""
    
    def __init__(self):
        """Initialize Supabase connection"""
        self.url = os.getenv("SUPABASE_URL", "")
        self.key = os.getenv("SUPABASE_KEY", "")
        
        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")
        
        # Create Supabase client
        self.client: Client = create_client(self.url, self.key)
    
    def insert_question(self, question_data: dict) -> Optional[dict]:
        """
        Insert a question into the questions table.
        
        Schema: questions(id, question_text, topic, qtype, marks, question_number, created_at)
        
        Args:
            question_data: Dictionary with question fields
        
        Returns:
            Inserted question record
        """
        try:
            response = self.client.table("questions").insert(question_data).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error inserting question: {e}")
            return None
    
    def insert_study_log(self, log_data: dict) -> Optional[dict]:
        """
        Insert a study log into the study_logs table.
        
        Schema: study_logs(id, topic, log_type, difficulty, hours, notes, created_at)
        
        Args:
            log_data: Dictionary with study log fields
        
        Returns:
            Inserted study log record
        """
        try:
            response = self.client.table("study_logs").insert(log_data).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error inserting study log: {e}")
            return None
    
    def insert_plan(self, plan_data: dict) -> Optional[dict]:
        """
        Insert a plan into the plans table.
        
        Schema: plans(id, plan_json, created_at)
        
        Args:
            plan_data: Dictionary with plan fields (must include 'plan_json')
        
        Returns:
            Inserted plan record
        """
        try:
            response = self.client.table("plans").insert(plan_data).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error inserting plan: {e}")
            return None
    
    def get_all_questions(self) -> List[Dict[str, Any]]:
        """
        Get all questions from the database.
        
        Returns:
            List of all questions
        """
        try:
            response = self.client.table("questions").select("*").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching questions: {e}")
            return []
    
    def get_all_study_logs(self) -> List[Dict[str, Any]]:
        """
        Get all study logs from the database.
        
        Returns:
            List of all study logs
        """
        try:
            response = self.client.table("study_logs").select("*").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching study logs: {e}")
            return []
    
    def get_latest_plan(self) -> Optional[Dict[str, Any]]:
        """
        Get the most recent plan from the database.
        
        Returns:
            Latest plan record or None
        """
        try:
            response = (
                self.client.table("plans")
                .select("*")
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error fetching latest plan: {e}")
            return None
    
    def delete_study_log(self, log_id: str) -> bool:
        """
        Delete a study log by ID.
        
        Args:
            log_id: The ID of the study log to delete
        
        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            response = self.client.table("study_logs").delete().eq("id", log_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting study log: {e}")
            return False
    
    def delete_all_study_logs(self) -> bool:
        """
        Delete all study logs from the database.
        
        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            # Get all log IDs first
            all_logs = self.get_all_study_logs()
            if not all_logs or len(all_logs) == 0:
                return True  # Nothing to delete
            
            # Delete all logs by their IDs in batch
            log_ids = [log.get('id') for log in all_logs if log.get('id')]
            
            if log_ids:
                # Delete each log individually (Supabase doesn't support bulk delete easily)
                for log_id in log_ids:
                    try:
                        self.client.table("study_logs").delete().eq("id", log_id).execute()
                    except Exception as e:
                        print(f"Error deleting log {log_id}: {e}")
                        # Continue with other deletions
            
            return True
        except Exception as e:
            print(f"Error deleting all study logs: {e}")
            return False


# Singleton instance
db = Database()

