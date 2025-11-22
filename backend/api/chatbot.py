from fastapi import APIRouter
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import httpx

load_dotenv()

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    userName: str = None

@router.post("/")
async def chat_with_bot(chat_message: ChatMessage):
    """
    Handles a chat message from the user and returns a response from the OpenRouter API.
    """
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")

        if not api_key:
            return {"response": "I'm sorry, but the chatbot is not properly configured. Please contact support."}

        # System prompt to restrict responses to education topics only
        system_prompt = """You are ExamPulse Assistant, a helpful AI tutor specialized in education and exam preparation.

Your role is to ONLY assist with:
- Education-related questions
- Exam preparation and study strategies
- Subject explanations and learning concepts
- Study planning and time management
- Academic guidance and motivation

IMPORTANT RULES:
- If a user asks anything unrelated to education or exam preparation, politely decline and redirect them to educational topics
- Always be encouraging and supportive in your responses
- Keep responses concise and helpful"""

        # Add user name context if provided
        if chat_message.userName:
            system_prompt += f"\n- Address the user as {chat_message.userName} in your responses"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "x-ai/grok-4.1-fast:free",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": chat_message.message}
                    ]
                },
                timeout=60.0
            )

            result = response.json()

            # Check for errors in the response
            if "error" in result:
                error_msg = result["error"].get("message", "Unknown error")
                print(f"OpenRouter API Error: {error_msg}")
                print(f"Full error response: {result}")

                # Try to provide helpful error message
                if "credits" in error_msg.lower() or "balance" in error_msg.lower():
                    return {"response": "I'm experiencing service limitations. Please try again later."}
                elif "model" in error_msg.lower():
                    return {"response": "I'm updating my systems. Please try again in a moment."}
                else:
                    return {"response": f"Service temporarily unavailable. Please try again."}

            # Validate the response structure
            if "choices" in result and len(result["choices"]) > 0:
                bot_response = result["choices"][0]["message"]["content"]
                return {"response": bot_response}
            else:
                print(f"Unexpected response structure: {result}")
                return {"response": "I'm sorry, I couldn't generate a response. Please try again."}

    except httpx.TimeoutException:
        return {"response": "The request took too long. Please try again with a shorter question."}
    except httpx.RequestError:
        return {"response": "I'm having trouble connecting to my services. Please check your internet connection and try again."}
    except KeyError:
        return {"response": "I received an unexpected response. Please try asking your question again."}
    except Exception:
        return {"response": "I'm sorry, something went wrong. Please try again."}
