"""
Database utilities
Handles Supabase connection and operations.
"""

from typing import Optional
import os


class Database:
    """Supabase database client"""
    
    def __init__(self):
        """Initialize Supabase connection"""
        # TODO: Initialize Supabase client
        self.url = os.getenv("SUPABASE_URL", "")
        self.key = os.getenv("SUPABASE_KEY", "")
    
    def insert_question(self, question_data: dict) -> Optional[dict]:
        """
        Insert a question into the questions table.
        
        Schema: questions(id, question_text, topic, qtype, marks, question_number, created_at)
        
        Args:
            question_data: Dictionary with question fields
        
        Returns:
            Inserted question record
        """
        # TODO: Implement Supabase insert
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
        # TODO: Implement Supabase insert
        return None
    
    def insert_plan(self, plan_data: dict) -> Optional[dict]:
        """
        Insert a plan into the plans table.
        
        Schema: plans(id, plan_json, created_at)
        
        Args:
            plan_data: Dictionary with plan fields
        
        Returns:
            Inserted plan record
        """
        # TODO: Implement Supabase insert
        return None


# Singleton instance
db = Database()

