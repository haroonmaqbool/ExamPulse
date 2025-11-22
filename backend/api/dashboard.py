"""
Dashboard statistics endpoint
Provides real-time dashboard data from the database.
"""

from typing import Dict, List
from collections import Counter
from datetime import datetime, timedelta
from fastapi import APIRouter

from utils.database import db

router = APIRouter()


@router.get("/")
async def get_dashboard_stats() -> Dict:
    """
    Get dashboard statistics from the database.
    
    Returns:
        Dashboard statistics including:
        - totalPapersUploaded: Number of unique papers analyzed
        - topicsAnalyzed: Number of unique topics
        - predictedQuestions: Total number of questions
        - studyProgress: Study progress percentage
        - studyStreak: Consecutive days with study activity
        - lastActivity: Time since last activity
        - accuracyScore: Calculated accuracy score
        - daysUntilExam: Days until exam (placeholder, can be configured)
    """
    try:
        # Get all questions
        all_questions = db.get_all_questions()
        
        # Get all study logs
        all_study_logs = db.get_all_study_logs()
        
        # Calculate statistics
        total_questions = len(all_questions)
        
        # Count unique topics
        topics = [q.get('topic', 'Unknown') for q in all_questions if q.get('topic') and q.get('topic') != 'Unknown']
        unique_topics = len(set(topics))
        
        # Count unique papers
        # Since we don't track file_id in questions table, estimate based on question patterns
        # A typical paper has 5-20 questions, so we'll use an average
        if total_questions > 0:
            # Estimate: assume average 10 questions per paper
            total_papers = max(1, (total_questions + 9) // 10)  # Round up
        else:
            total_papers = 0
        
        # Calculate study progress
        total_study_hours = sum([float(log.get('hours', 0)) for log in all_study_logs if log.get('hours')])
        # Assume target is 100 hours for 100% progress (adjustable)
        target_hours = 100.0
        study_progress = min(100, int((total_study_hours / target_hours) * 100)) if target_hours > 0 else 0
        
        # Calculate study streak
        if all_study_logs:
            # Sort logs by created_at
            sorted_logs = sorted(
                all_study_logs,
                key=lambda x: x.get('created_at', ''),
                reverse=True
            )
            
            # Calculate consecutive days
            streak = 0
            current_date = datetime.now().date()
            
            for log in sorted_logs:
                if log.get('created_at'):
                    try:
                        # Handle different datetime formats
                        created_at = log['created_at']
                        if 'T' in created_at:
                            log_date = datetime.fromisoformat(created_at.replace('Z', '+00:00')).date()
                        else:
                            log_date = datetime.strptime(created_at.split()[0], '%Y-%m-%d').date()
                        
                        days_diff = (current_date - log_date).days
                        
                        if days_diff == streak:
                            streak += 1
                        elif days_diff > streak:
                            break
                    except Exception as e:
                        print(f"Error parsing date in streak calculation: {e}")
                        continue
            
            study_streak = streak
        else:
            study_streak = 0
        
        # Get last activity
        last_activity = "No activity yet"
        if all_study_logs:
            sorted_logs = sorted(
                all_study_logs,
                key=lambda x: x.get('created_at', ''),
                reverse=True
            )
            if sorted_logs and sorted_logs[0].get('created_at'):
                try:
                    last_activity_time = datetime.fromisoformat(
                        sorted_logs[0]['created_at'].replace('Z', '+00:00')
                    )
                    time_diff = datetime.now(last_activity_time.tzinfo) - last_activity_time
                    
                    if time_diff.days > 0:
                        last_activity = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
                    elif time_diff.seconds >= 3600:
                        hours = time_diff.seconds // 3600
                        last_activity = f"{hours} hour{'s' if hours > 1 else ''} ago"
                    elif time_diff.seconds >= 60:
                        minutes = time_diff.seconds // 60
                        last_activity = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
                    else:
                        last_activity = "Just now"
                except:
                    last_activity = "Recently"
        
        # Calculate accuracy score (based on study logs with difficulty)
        # Higher accuracy = more easy/medium logs, fewer hard logs
        if all_study_logs:
            difficulty_counts = Counter([log.get('difficulty', 'medium') for log in all_study_logs if log.get('difficulty')])
            total_difficulty_logs = sum(difficulty_counts.values())
            
            if total_difficulty_logs > 0:
                easy_count = difficulty_counts.get('easy', 0)
                medium_count = difficulty_counts.get('medium', 0)
                hard_count = difficulty_counts.get('hard', 0)
                
                # Calculate weighted accuracy
                accuracy = int(
                    ((easy_count * 1.0 + medium_count * 0.7 + hard_count * 0.3) / total_difficulty_logs) * 100
                )
            else:
                accuracy = 75  # Default if no difficulty logs
        else:
            accuracy = 0
        
        # Days until exam (placeholder - can be made configurable)
        # For now, set a default or calculate from study plan
        days_until_exam = 30  # Default placeholder
        
        return {
            "totalPapersUploaded": total_papers,
            "topicsAnalyzed": unique_topics,
            "predictedQuestions": total_questions,
            "studyProgress": study_progress,
            "studyStreak": study_streak,
            "lastActivity": last_activity,
            "accuracyScore": accuracy,
            "daysUntilExam": days_until_exam
        }
        
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        # Return default values on error
        return {
            "totalPapersUploaded": 0,
            "topicsAnalyzed": 0,
            "predictedQuestions": 0,
            "studyProgress": 0,
            "studyStreak": 0,
            "lastActivity": "No activity yet",
            "accuracyScore": 0,
            "daysUntilExam": 30
        }

