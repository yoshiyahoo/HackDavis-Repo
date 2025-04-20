import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';

// Check if API key exists
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function generateQuiz(lessonData) {
  const { name, lesson } = lessonData;

  // If no API key is available, generate a mock quiz for testing
  if (!ai) {
    console.warn("No Gemini API key found. Using mock quiz generation instead.");
    return generateMockQuiz(name, lesson);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Model type or ID
      contents: `You will generate a quiz based on the provided lesson content. The quiz should be about "${name}".
      These quizzes will strictly be multiple choice, and you will create no more than 7 questions. 
      You will generate 4 choices for each multiple choice question. 
      You will also denote which answer is correct by marking it with "(**Correct**)". 
      The lesson content is as follows: ${lesson}`
    });

    return response.text;
  } catch (error) {
    console.error("Error generating quiz:", error);
    console.warn("Falling back to mock quiz generation.");
    return generateMockQuiz(name, lesson);
  }
}

// Function to generate a mock quiz when API is not available
 function generateMockQuiz(name, lesson) {
//   // Extract some keywords from the lesson for more relevant mock questions
  const keywords = lesson.split(/\s+/).filter(word => word.length > 5).slice(0, 10);
  
  // Create a simple mock quiz based on the name and extracted keywords
  return `
1. What is the main topic of this lesson?
a) JavaScript programming
b) ${name} (**Correct**)
c) Database management
d) Network security

2. Which of the following best describes ${name}?
a) A programming language
b) A database system
c) ${keywords[0] || "A data structure"} (**Correct**)
d) A network protocol

3. What is a key advantage of ${name}?
a) ${keywords[1] || "Dynamic size"} (**Correct**)
b) Static typing
c) Automatic garbage collection
d) Built-in encryption

4. Which operation is commonly performed with ${name}?
a) Compilation
b) Decompression
c) ${keywords[2] || "Traversal"} (**Correct**)
d) Encryption
`;
}

async function parseQuiz(quizText) {
  if (!quizText) {
    console.error("Quiz text was not provided.");
    return null;
  }

  const lines = quizText.split("\n");
  const questions = [];
  let currentQuestion = null;
  let currentChoices = [];
  let correctAnswerIndex = -1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this is a question (starts with a number followed by a period or parenthesis)
    if (/^\d+[\.\)]/.test(trimmedLine)) {
      // If we have a previous question, save it
      if (currentQuestion) {
        questions.push({
          question: currentQuestion,
          choices: currentChoices,
          correctAnswer: correctAnswerIndex
        });
      }
      
      // Start a new question
      currentQuestion = trimmedLine.replace(/^\d+[\.\)]\s*/, '');
      currentChoices = [];
      correctAnswerIndex = -1;
    } 
    // Check if this is a choice (starts with a letter followed by a period or parenthesis)
    else if (/^[a-d][\.\)]/.test(trimmedLine.toLowerCase())) {
      const choiceText = trimmedLine.replace(/^[a-d][\.\)]\s*/, '');
      const isCorrect = choiceText.includes('(**Correct**)');
      
      // Add to choices and mark as correct if needed
      currentChoices.push(choiceText.replace('(**Correct**)', '').trim());
      
      if (isCorrect) {
        correctAnswerIndex = currentChoices.length - 1;
      }
    }
  }
  
  // Add the last question if there is one
  if (currentQuestion && currentChoices.length > 0) {
    questions.push({
      question: currentQuestion,
      choices: currentChoices,
      correctAnswer: correctAnswerIndex
    });
  }

  return questions;
}

async function main() {
  try {
    // Check if the API key is available
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set.");
      console.warn("Please create a .env file based on .env.example with your API key.");
      console.warn("Continuing with mock quiz generation...");
    }

    // Read the JSON file containing the lesson data
    let lessonData;
    try {
      const lessonDataRaw = await fs.readFile('lesson.json', 'utf8');
      lessonData = JSON.parse(lessonDataRaw);
    } catch (error) {
      console.error('Error reading lesson.json:', error.message);
      console.warn('Using default lesson data...');
      lessonData = {
        name: "Sample Topic",
        lesson: "This is a sample lesson content for testing purposes."
      };
    }
    
    // Generate quiz text based on the lesson data
    const quizText = await generateQuiz(lessonData);
    
    // Parse the quiz text into a structured format
    const quizQuestions = await parseQuiz(quizText);
    
    // Output the structured quiz
    console.log(JSON.stringify(quizQuestions, null, 2));
    
    // Save to a file in the root directory
    await fs.writeFile('quiz.json', JSON.stringify(quizQuestions, null, 2));
    
    // Also save to the public directory for frontend access
    try {
      await fs.writeFile('public/quiz.json', JSON.stringify(quizQuestions, null, 2));
      console.log('Quiz generated and saved to quiz.json and public/quiz.json');
    } catch (error) {
      console.error('Error saving to public directory:', error.message);
      console.log('Quiz generated and saved to quiz.json only');
    }
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the main function
main();
