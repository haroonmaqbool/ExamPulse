"""
AI Client Module
Handles all Gemini AI interactions.
All LLM calls must go through ai_client.run_gemini_prompt().
"""

from typing import Dict, Any
import os


class AIClient:
    """Client for interacting with Gemini AI"""
    
    def __init__(self):
        """Initialize AI client with API key"""
        # TODO: Load Gemini API key from environment
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        # TODO: Initialize Gemini client
    
    def run_gemini_prompt(self, prompt: str, system_instruction: str = None) -> Dict[str, Any]:
        """
        Execute a Gemini AI prompt.
        
        This is the ONLY method that should be used for LLM calls.
        
        Args:
            prompt: The user prompt/question
            system_instruction: Optional system instruction for the AI
        
        Returns:
            Response from Gemini AI as JSON
        """
        # TODO: Implement Gemini API call
        # - Format prompt with system instruction if provided
        # - Call Gemini API
        # - Parse and return JSON response
        return {
            "message": "Gemini AI call - placeholder",
            "prompt": prompt
        }


# Singleton instance
ai_client = AIClient()

