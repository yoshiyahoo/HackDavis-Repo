// Quiz data interface matching the structure from gemini.js
export interface QuizQuestion {
  question: string;
  choices: string[];
  correctAnswer: number;
}

// Default quiz data in case the JSON file isn't available
const defaultQuizData: QuizQuestion[] = [
  {
    question: "What is a linked list?",
    choices: [
      "A data structure that stores elements in contiguous memory locations.",
      "A linear data structure where elements are not stored in contiguous memory locations.",
      "A data structure that only allows access to the last element.",
      "A data structure that automatically sorts elements.",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a node in a linked list composed of?",
    choices: [
      "Only data.",
      "Data and an index.",
      "Data and a pointer to the next node.",
      "Only a pointer to the next node.",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which of the following is a basic operation performed on a linked list?",
    choices: ["Sorting", "Traversal", "Searching in reverse", "Encryption"],
    correctAnswer: 1,
  },
];

/**
 * Loads quiz data from a JSON file or returns default data if not available
 * @param quizName Optional name of the quiz to load
 * @returns Promise that resolves to an array of quiz questions
 */
export async function loadQuizData(quizName?: string): Promise<QuizQuestion[]> {
  try {
    // In a real app, this would be a fetch call to an API endpoint
    // For now, we'll simulate loading from a static path
    const response = await fetch('/quiz.json');
    
    if (!response.ok) {
      console.warn('Failed to load quiz data, using default quiz');
      return defaultQuizData;
    }
    
    const quizData = await response.json();
    
    // If no quiz data or empty array, use default
    if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
      console.warn('Quiz data is empty, using default quiz');
      return defaultQuizData;
    }
    
    return quizData;
  } catch (error) {
    console.error('Error loading quiz data:', error);
    return defaultQuizData;
  }
}
