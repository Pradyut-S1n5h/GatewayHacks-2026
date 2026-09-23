// Replace with your actual backend public URL (no trailing slash at the end)[span_2](start_span)[span_2](end_span)
const API_BASE_URL = "yourbackendURL.dev";

async function fetchStudentReport() {
    const outputDiv = document.getElementById("output");
    outputDiv.textContent = "Connecting to backend and generating report/roadmap...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/student/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                student_id: "student_1",
                name: "Aarav",
                grade: 9,
                subjects: ["Mathematics"],
                language: "en"
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        console.log("Success:", data);

        // Display the received student report and roadmap nicely on the webpage
        outputDiv.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Error connecting to backend:", error);
        outputDiv.textContent = "Error: Could not fetch data. Check if your backend terminal is running and your API_BASE_URL is updated.";
    }
}
