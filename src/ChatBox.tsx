"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import Quiz from "./Quiz"

export default function ChatBox() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<any[] | null>(null)
  const [quizTitle, setQuizTitle] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:5001/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate quiz')
      }

      const data = await response.json()
      
      // Extract title from the first question or use default
      const title = data[0]?.question?.split(' ').slice(0, 3).join(' ') || "Generated Quiz"
      setQuizTitle(title)
      setQuizData(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseQuiz = () => {
    setQuizData(null)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {quizData ? (
        <Quiz onClose={handleCloseQuiz} title={quizTitle} />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-2">Ask Letta to Generate a Lesson</h2>
            <p className="text-muted-foreground text-sm">
              Type your topic or question, and Letta will generate a lesson. Then, a quiz will be automatically created to test your knowledge.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like to learn about?"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
