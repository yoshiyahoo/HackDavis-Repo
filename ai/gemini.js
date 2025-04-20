import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyArpOOB2erAy0uykkHhis9ZIydjq8FJ_pk"});


async function generateQuiz() {
  const lessonplan = `*   Define what a linked list is and differentiate it from an array.
*   Explain the concepts of nodes, data, and pointers in the context of linked lists.
*   Describe the basic operations on a linked list:  traversal, insertion, and deletion.
*   Identify the advantages and disadvantages of using linked lists compared to arrays.
*   Recognize real-world scenarios where linked lists are applicable.

**3. Overview / Introduction (5 minutes)**

*   **Hook:** Start with a relatable scenario. "Imagine you're organizing a scavenger hunt, and each clue leads to the next.  That's similar to how a linked list works – each item *points* to the next."
*   **What is a Data Structure?:** Briefly explain that data structures are ways of organizing and storing data in a computer so that it can be used efficiently.
*   **Introduce Linked Lists:**  Explain that a linked list is a fundamental data structure that is a sequence of *nodes*.
*   **Contrast with Arrays:** Briefly mention Arrays as another common data structure, stating that linked lists are different and have their own pros and cons.

**4. Key Concepts Explained in Simple Terms (10 minutes)**

*   **Node:** (Followed by the full lesson content...)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Model type or ID
      contents: `You will generate a quiz based off a provided lesson plan. These quizzes will strictly be multiple choice, and you will create no more than 7 questions. You will generate 4 choices for the multiple choice. You will also denote which answer is correct. you will denote an answer is correct with "(**Correct**)". The lesson plan is as follows: ${lessonplan}`
    });

    return response.text;
 //   console.log(response.text);
  } catch (error) {
    console.error("Error generating quiz:", error);
  }
}
async function parseQuiz() {
    const quiz = await generateQuiz();
  

    if (!quiz) {
      console.error("Quiz was not generated.");
      return;
    }
  
    const lines = quiz.split("\n");
  
    let sanitizedQuiz = "";
    let answerKeyList = [];
    let currentChoices = [];
    let currentAnswerIndex = -1;
    let questionNumber = 0;
  
    const choiceLabels = ["a", "b", "c", "d"];
  
    for (let line of lines) {
      const trimmed = line.trim();
  
      if (/^\d+\.\s/.test(trimmed)) {

        if (currentAnswerIndex !== -1) {
          answerKeyList.push(`${questionNumber}. ${choiceLabels[currentAnswerIndex]}`);
        }
  
        questionNumber += 1;
        currentChoices = [];
        currentAnswerIndex = -1;
        sanitizedQuiz += line + "\n";
      } else if (trimmed.startsWith("*")) {

        const isCorrect = trimmed.includes("(**Correct**)");
        const cleaned = trimmed.replace("(**Correct**)", "").replace(/^\*\s*/, "").trim();
        const label = choiceLabels[currentChoices.length];
        sanitizedQuiz += `    (${label}) ${cleaned}\n`;
  
        if (isCorrect) {
          currentAnswerIndex = currentChoices.length;
        }
  
        currentChoices.push(cleaned);
      } else {

        sanitizedQuiz += line + "\n";
      }
    }
  
    if (currentAnswerIndex !== -1) {
      answerKeyList.push(`${questionNumber}. ${choiceLabels[currentAnswerIndex]}`);
    }
  
    console.log("=== Sanitized Quiz ===\n" + sanitizedQuiz.trim());
  //  console.log(quiz);
    console.log("\n=== Answer Key ===\n" + answerKeyList.join("\n"));
  
    return [sanitizedQuiz.trim(), answerKeyList.join("\n")];
  }
  
  parseQuiz();