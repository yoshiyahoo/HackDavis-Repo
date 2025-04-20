"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "./lib/utils"
import { loadQuizData, QuizQuestion } from "./utils/quizLoader"

interface QuizProps {
  onClose?: () => void
  title?: string
}

// Keep mockQuiz as a fallback in case data loading fails
const mockQuiz = [
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
  {
    question: "What is a primary advantage of linked lists over arrays?",
    choices: [
      "Faster access to elements.",
      "Elements stored in contiguous memory",
      "Dynamic size allocation.",
      "More efficient memory usage.",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is a pointer in the context of a linked list?",
    choices: [
      "A variable that stores data.",
      "A variable that stores the memory address of another node.",
      "A variable that stores the size of the linked list.",
      "A variable that stores the name of the linked list.",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which operation involves visiting each node in a linked list, one after another?",
    choices: ["Insertion", "Deletion", "Traversal", "Sorting"],
    correctAnswer: 2,
  },
  {
    question: "In the scavenger hunt analogy, what does each clue represent in a linked list?",
    choices: ["The entire linked list", "A node", "The array", "The starting point"],
    correctAnswer: 1,
  },
]

export default function Quiz({ onClose, title = "Linked List Quiz" }: QuizProps) {
  const [quizData, setQuizData] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // Load quiz data when component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true)
        const data = await loadQuizData()
        setQuizData(data)
        // Initialize answers array with the correct length
        setAnswers(Array(data.length).fill(null))
      } catch (error) {
        console.error("Failed to load quiz data:", error)
        // Fallback to mock quiz if loading fails
        setQuizData(mockQuiz)
        setAnswers(Array(mockQuiz.length).fill(null))
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [])

  const handleSelect = (questionIndex: number, choiceIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = choiceIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setShowResults(true)
  }

  const correctCount = answers.filter((answer, i) => 
    quizData.length > 0 && i < quizData.length ? answer === quizData[i].correctAnswer : false
  ).length

  const percentage = quizData.length > 0 ? Math.round((correctCount / quizData.length) * 100) : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-rose-500"
  }

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < quizData.length) {
      setCurrentQuestion(index)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      console.warn('No onClose handler provided to Quiz component')
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-xl relative max-w-3xl w-full">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close quiz"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-t-sidebar-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300">Loading quiz questions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl relative max-w-3xl w-full">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close quiz"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#646cff] to-[#61dafb] dark:from-[#646cff] dark:to-[#61dafb]">
          {title}
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          Test your knowledge of {title.replace(" Quiz", "")}
        </p>

        {!showResults ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Question {currentQuestion + 1} of {quizData.length}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateToQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                  className={cn(
                    "p-2 rounded-lg",
                    currentQuestion === 0
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                  aria-label="Previous question"
                >
                  Previous
                </button>
                <button
                  onClick={() => navigateToQuestion(currentQuestion + 1)}
                  disabled={currentQuestion === quizData.length - 1}
                  className={cn(
                    "p-2 rounded-lg",
                    currentQuestion === quizData.length - 1
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                  aria-label="Next question"
                >
                  Next
                </button>
              </div>
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                {quizData.length > 0 && quizData[currentQuestion]?.question}
              </h2>

              <div className="space-y-3">
                {quizData.length > 0 &&
                  quizData[currentQuestion]?.choices.map((choice, j) => (
                  <div
                    key={j}
                    onClick={() => handleSelect(currentQuestion, j)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all hover:border-sidebar-primary group",
                      answers[currentQuestion] === j
                        ? "border-sidebar-primary bg-accent/20"
                        : "border-slate-200 dark:border-slate-700",
                    )}
                  >
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all",
                          answers[currentQuestion] === j
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "bg-muted group-hover:bg-accent/50",
                        )}
                      >
                        {String.fromCharCode(97 + j)}
                      </div>
                      <span className="text-slate-700 dark:text-slate-200">{choice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {answers.filter((a) => a !== null).length} of {quizData.length} questions answered
              </div>
              <button
                onClick={handleSubmit}
                disabled={answers.includes(null)}
                className={cn(
                  "px-6 py-3 rounded-lg font-semibold text-white transition-all",
                  answers.includes(null)
                    ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#646cff] to-[#61dafb] hover:from-[#535bf2] hover:to-[#50c8f0] shadow-md hover:shadow-lg",
                )}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center p-8 bg-card rounded-lg shadow-sm border border-border">
              <div className="mb-4 text-6xl font-bold">
                {correctCount} / {quizData.length}
              </div>
              <div className="text-xl font-semibold text-card-foreground">
                You scored {percentage}%
              </div>
              <div className={cn("mt-4 text-sm", getScoreColor(percentage))}>
                {percentage >= 80
                  ? "Excellent! You've mastered this material."
                  : percentage >= 60
                  ? "Good job! You have a solid understanding."
                  : "Keep practicing! You can do it."}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-lg font-semibold">
                <Check className="mr-2 text-emerald-500" /> Correct Answers
              </div>
              <ul className="list-disc pl-5">
                {quizData
                  .map(
                    (quiz, index) =>
                      answers[index] === quiz.correctAnswer && (
                        <li key={index}>{quiz.question}</li>
                      ),
                  )
                  .slice(0, 5)}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-lg font-semibold">
                <AlertCircle className="mr-2 text-rose-500" /> Incorrect Answers
              </div>
              <ul className="list-disc pl-5">
                {quizData
                  .map(
                    (quiz, index) =>
                      answers[index] !== quiz.correctAnswer && (
                        <li key={index}>{quiz.question}</li>
                      ),
                  )
                  .slice(0, 5)}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
