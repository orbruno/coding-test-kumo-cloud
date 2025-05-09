import React, { useState } from 'react'
import UploadForm from './components/UploadForm'
import ManualDisplay from './components/ManualDisplay'
import Quiz, { QuizQuestion } from './components/Quiz'

const App: React.FC = () => {
  const [manual, setManual] = useState<string>('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (files: File[], prompt: string) => {
    setLoading(true)
    setError(null)
    setManual('')
    setQuiz([])

    try {
      const body = new FormData()
      files.forEach(f => body.append('files', f))
      body.append('prompt', prompt)

      const res = await fetch('/api/manual', {
        method: 'POST',
        body,
      })
      const text = await res.text()
      if (!res.ok) {
        const err = JSON.parse(text)
        throw new Error(err.detail || text)
      }
      const data = JSON.parse(text) as { manual: string; quiz: QuizQuestion[] }
      setManual(data.manual)
      setQuiz(data.quiz)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>📄 Manual & Quiz Generator</h1>
      <UploadForm onGenerate={handleGenerate} loading={loading} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {manual && (
        <section style={{ marginTop: 40 }}>
          <h2>Generated Manual</h2>
          <ManualDisplay manual={manual} />
        </section>
      )}

      {quiz.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2>Quiz Time</h2>
          <Quiz quiz={quiz} />
        </section>
      )}
    </div>
  )
}

export default App