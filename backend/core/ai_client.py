"""
AI Client Module
Handles all AI interactions via OpenRouter (supports Grok and DeepSeek).
All LLM calls must go through ai_client.run_ai_prompt().
"""

from typing import Dict, Any, Optional
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class AIClient:
    """Client for interacting with AI via OpenRouter (supports Grok and DeepSeek)"""
    
    def __init__(self):
        """Initialize AI client with OpenRouter API key"""
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        
        if not self.api_key:
            raise ValueError(
                "OPENROUTER_API_KEY must be set in .env file. "
                "Get your API key from https://openrouter.ai/keys"
            )
        
        # Validate API key format (OpenRouter keys start with sk-or-v1-)
        if not self.api_key.startswith("sk-or-v1-"):
            raise ValueError(
                f"Invalid OPENROUTER_API_KEY format. "
                f"OpenRouter API keys should start with 'sk-or-v1-'. "
                f"Get your API key from https://openrouter.ai/keys"
            )
        
        # OpenRouter API endpoint
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        
        # Model selection: Grok or DeepSeek (configurable via .env)
        # Options: "grok", "deepseek", "deepseek-r1", or specific model name
        model_preference = os.getenv("AI_MODEL", "grok").lower()
        
        if model_preference == "deepseek-r1":
            # DeepSeek R1 (reasoning model, free tier)
            self.model_name = "deepseek/deepseek-r1:free"
        elif model_preference == "grok":
            # Grok 4.1 Fast (free)
            self.model_name = "x-ai/grok-4.1-fast:free"
        else:
            # Allow custom model name
            self.model_name = model_preference
        
        print(f"AI Model configured: {self.model_name}")
        
        # Track if we've detected an API key error (to fail fast)
        self._api_key_invalid = False
    
    def run_ai_prompt(
        self, 
        prompt: str, 
        system_instruction: Optional[str] = None,
        response_format: str = "json"
    ) -> Dict[str, Any]:
        """
        Execute an AI prompt via OpenRouter (Grok or DeepSeek).
        
        This is the ONLY method that should be used for LLM calls.
        
        Args:
            prompt: The user prompt/question
            system_instruction: Optional system instruction for the AI
            response_format: Expected response format ("json" or "text")
        
        Returns:
            Response from AI as JSON (parsed) or dict
        """
        try:
            # Prepare messages for OpenAI-compatible API
            messages = []
            
            # Add system instruction if provided
            if system_instruction:
                messages.append({
                    "role": "system",
                    "content": system_instruction
                })
            
            # Add JSON format instruction to user prompt if needed
            user_prompt = prompt
            if response_format == "json":
                user_prompt += "\n\nReturn ONLY valid JSON. Do not include any text outside the JSON."
            
            messages.append({
                "role": "user",
                "content": user_prompt
            })
            
            # Prepare request headers (matching OpenRouter API format)
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/haroonmaqbool/ExamPulse",  # Optional: for OpenRouter analytics
                "X-Title": "ExamPulse"  # Optional: for OpenRouter analytics
            }
            
            # Prepare request payload
            payload = {
                "model": self.model_name,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 4096
            }
            
            # Optional: Enable reasoning for Grok (can be enabled if needed)
            # payload["extra_body"] = {"reasoning": {"enabled": True}}
            
            # Make API request (using json.dumps format as per OpenRouter docs)
            response = requests.post(
                self.api_url,
                headers=headers,
                data=json.dumps(payload),  # Using data=json.dumps() format
                timeout=60  # 60 second timeout
            )
            
            # Check for HTTP errors
            response.raise_for_status()
            
            # Parse response
            response_data = response.json()
            
            # Extract text from response
            if "choices" in response_data and len(response_data["choices"]) > 0:
                response_text = response_data["choices"][0]["message"]["content"].strip()
            else:
                return {
                    "error": "No response from API",
                    "raw_response": response_data
                }
            
            # Try to parse as JSON if requested
            if response_format == "json":
                # Sometimes AI wraps JSON in markdown code blocks, remove them
                if response_text.startswith("```json"):
                    response_text = response_text[7:]  # Remove ```json
                if response_text.startswith("```"):
                    response_text = response_text[3:]  # Remove ```
                if response_text.endswith("```"):
                    response_text = response_text[:-3]  # Remove closing ```
                
                response_text = response_text.strip()
                
                # Parse JSON
                try:
                    return json.loads(response_text)
                except json.JSONDecodeError as e:
                    # If JSON parsing fails, return error info
                    return {
                        "error": "Failed to parse JSON response",
                        "raw_response": response_text,
                        "parse_error": str(e)
                    }
            else:
                # Return as text
                return {"response": response_text}
                
        except requests.exceptions.HTTPError as e:
            # Handle HTTP errors (401, 403, 429, etc.)
            status_code = e.response.status_code if hasattr(e, 'response') and e.response else None
            
            if status_code == 401:
                # API key is invalid or expired
                self._api_key_invalid = True
                return {
                    "error": "OpenRouter API key is invalid or expired",
                    "error_type": "authentication_error",
                    "error_message": "401 Unauthorized - Check your OPENROUTER_API_KEY in .env file",
                    "help": "Get a valid API key from https://openrouter.ai/keys"
                }
            elif status_code == 403:
                return {
                    "error": "OpenRouter API access forbidden",
                    "error_type": "authorization_error",
                    "error_message": "403 Forbidden - Check your API key permissions"
                }
            elif status_code == 429:
                return {
                    "error": "OpenRouter API rate limit exceeded",
                    "error_type": "rate_limit_error",
                    "error_message": "429 Too Many Requests - Please wait before retrying"
                }
            else:
                return {
                    "error": "OpenRouter API request failed",
                    "error_type": "http_error",
                    "error_message": str(e),
                    "status_code": status_code
                }
        except requests.exceptions.RequestException as e:
            # Handle network/timeout errors
            return {
                "error": "OpenRouter API request failed",
                "error_type": "network_error",
                "error_message": str(e),
                "prompt": prompt
            }
        except Exception as e:
            # Handle any other errors
            return {
                "error": "AI API call failed",
                "error_message": str(e),
                "prompt": prompt
            }


    def is_api_key_valid(self) -> bool:
        """
        Check if API key is valid by making a test request.
        Returns True if valid, False otherwise.
        """
        if self._api_key_invalid:
            return False
        
        # Make a minimal test request
        test_response = self.run_ai_prompt(
            "Say 'test'",
            system_instruction="You are a test assistant.",
            response_format="text"
        )
        
        return "error" not in test_response


# Singleton instance
ai_client = AIClient()

