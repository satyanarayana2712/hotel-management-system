import google.generativeai as genai

# ADD YOUR API KEY
genai.configure(
    api_key="AIzaSyCR9ytK4qhMOTHZ8idMiOe0ko6Nm0d77bE"
)

# LIST AVAILABLE MODELS
models = genai.list_models()

print("\nAvailable Models:\n")

for model in models:

    if "generateContent" in model.supported_generation_methods:

        print(model.name)