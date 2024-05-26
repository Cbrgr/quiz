import { socket } from '@/socket'
import { QuestionType } from '@/utils/types/question'
import { useEffect, useState } from 'react'
import Question from './Question'

const GamemodeQCM = () => {
  const [question, setQuestion] = useState<QuestionType | undefined>(undefined)

  const onQuestion = (questionData: QuestionType) => {
    setQuestion(questionData)
  }

  useEffect(() => {
    socket.on('question', onQuestion)
    return () => {
      socket.off('question', onQuestion)
    }
  }, [])

  return (
    <div>
      <p>GAMEMODE QCM</p>
      {question && <Question question={question} />}
    </div>
  )
}
export default GamemodeQCM
