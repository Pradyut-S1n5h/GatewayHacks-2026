# GatewayHacks-2026
🎓 Project Research & Opportunity

The Problem

Access to education does not necessarily mean access to personalized education.

India has extensive free educational infrastructure, including digital content and government learning platforms. However, students can still have significantly different learning levels within the same grade.

Private tutoring can provide individualized support, but it introduces a recurring affordability barrier.

Our central question:

«How can we make the personalization layer of tutoring accessible to students who cannot rely on expensive private instruction?»

---

📊 Evidence

Several indicators point toward a meaningful gap:

- Approximately 90 million enrolled Indian schoolchildren are estimated to use offline private tuition.
- The World Bank estimates India's small-group and one-to-one private tutoring market at ₹800 billion+.
- ASER 2024 found that only 23.4% of rural government-school Std III students could read a Std II-level text.
- 89.1% of rural 14–16-year-olds had a smartphone available at home, showing that digital access is increasing—but access to a device does not automatically provide personalized learning.

Sources

- "ASER Centre — ASER 2024" (https://asercentre.org/aser-2024/)
- "ASER 2024 Report" (https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24.pdf)
- "World Bank — Private Tutoring in India" (https://documents1.worldbank.org/curated/en/099940306292229445/pdf/IDU0e3fbb6ee04c8e0494c0a8240b47374fffa19.pdf)

---

🔎 Existing Solutions

Government educational platforms

DIKSHA / PM e-VIDYA

Provide large-scale educational content, multiple languages, offline resources and alternative delivery methods.

"PM e-VIDYA" (https://pmevidya.education.gov.in/)

AI tutoring

Khanmigo / Khan Academy

Provides guided AI tutoring and is increasingly experimenting with student mastery and prerequisite information to personalize learning.

"Khan Academy" (https://www.khanacademy.org/)

Private tutoring

Human tutors provide highly individualized instruction, but the model can be expensive and difficult to scale affordably.

General-purpose AI

LLMs can explain concepts, answer questions and generate practice material, but a general chatbot does not automatically maintain a structured model of a student's curriculum-wide learning gaps.

---

⚠️ The Gap

Existing solutions already solve important parts of the problem.

The opportunity is not to build another educational content library or another generic AI chatbot.

The remaining opportunity is to make the personalization layer of tutoring more accessible.

Existing landscape

Educational content
        ↓
      Access ✓

General AI
        ↓
   Explanations ✓

Private tutoring
        ↓
 Personalization ✓
        ↓
       $$$

        ↓
    THE GAP

Affordable + continuous
personalized remediation

---

💡 Our Opportunity

An India-First Learning Gap Engine

The proposed system focuses on identifying what a student actually understands, rather than assuming that their grade level represents their learning level.

Core loop

Diagnose
   ↓
Map learning gaps
   ↓
Identify prerequisites
   ↓
Personalize learning path
   ↓
Teach
   ↓
Practice
   ↓
Re-test
   ↓
Update learning map

The goal is not simply to answer a student's question.

The goal is to determine:

«What does this student need to learn next?»

---

🇮🇳 India-First Design

The initial system would focus on:

Curriculum alignment

Rather than attempting to teach every subject and grade, the MVP will begin with a tightly defined curriculum.

Multilingual learning

The initial prototype can support English and Hindi, with the architecture designed to expand to additional languages.

Accessibility

The system will prioritize:

- Low bandwidth
- Lightweight interfaces
- Shared-device usage
- Free core functionality

Accessibility is therefore treated as an engineering constraint, not just a social-impact statement.

---

🧪 MVP

The first prototype will focus on:

«CBSE Class 9 Mathematics»

with a small interconnected skill graph, for example:

Algebra
   ↓
Identities
   ↓
Factorisation
   ↓
Linear Equations
   ↓
Quadratics

A student could begin with a diagnostic assessment.

If the student struggles with quadratics, the system would investigate prerequisite concepts rather than immediately providing a quadratic-equation lesson.

For example:

Quadratics       ❌
      ↓
Factorisation    ❌
      ↓
Algebra          ✓

The system could then provide targeted remediation for factorisation before returning to quadratics.

---

📈 Measuring the Prototype

The prototype should demonstrate a measurable learning loop:

Diagnostic
   ↓
Example: 4/10
   ↓
Targeted remediation
   ↓
Practice
   ↓
Re-test
   ↓
Example: 8/10

This would demonstrate that the system can identify a learning gap and respond to it, rather than merely generating educational content.

«Important: prototype before/after results would demonstrate system behavior, not establish population-level educational impact.»

---

🎯 Core Principle

«School tells you what you should learn.
Our system helps discover what you actually need to learn next.»

Personalized learning should not depend entirely on a student's ability to pay for a personal tutor.

---

Research Links

- "ASER Centre" (https://asercentre.org/)
- "ASER 2024" (https://asercentre.org/aser-2024/)
- "World Bank — Private Tutoring in India" (https://documents1.worldbank.org/curated/en/099940306292229445/pdf/IDU0e3fbb6ee04c8e0494c0a8240b47374fffa19.pdf)
- "PM e-VIDYA" (https://pmevidya.education.gov.in/)
- "DIKSHA" (https://diksha.gov.in/)
- "Khan Academy" (https://www.khanacademy.org/)
- "Khanmigo" (https://www.khanacademy.org/khan-labs)
- "UNESCO — State of Education Report 2025: India" (https://www.unesco.org/en/articles/bhasha-matters-state-education-report-2025)
