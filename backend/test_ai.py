from core.ai_client import ai_client

# Test with a simple prompt
result = ai_client.run_gemini_prompt(
    "What is 2+2? Return the answer as JSON with a 'result' field.",
    response_format="json"
)

print("AI Client Test Result:")
print(result)
