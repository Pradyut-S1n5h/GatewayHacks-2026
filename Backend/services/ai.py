def query_ai_doubt(subject: str, question: str) -> str:
    cleaned_subject = subject.capitalize()
    
    if cleaned_subject not in ["Math", "Science", "Mathematics"]:
        return f"AI Tutor: I specialize in Math and Science NCERT concepts. Let's look at your query about {cleaned_subject}!"

    response_mapping = {
        "Math": f"Here is a step-by-step mathematical breakdown for: '{question}'. Check the NCERT textbook formulas related to this theorem.",
        "Science": f"Scientific explanation for: '{question}': According to NCERT principles, review the governing law and core variables."
    }
    
    return response_mapping.get(cleaned_subject, f"AI Tutor: Analyzing your {cleaned_subject} question based on official NCERT guidelines.")
