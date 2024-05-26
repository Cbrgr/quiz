import { QuestionType } from '@/utils/types/question'
import { useMemo, useState } from 'react'

type Props = {
  question: QuestionType
}

const Question = ({ question }: Props) => {
  const [currentAnswer, setCurrentAnswer] = useState<string | undefined>(
    undefined
  )
  const shuffledAnswers = useMemo(
    () => question.answers.sort(() => 0.5 - Math.random()),
    [question]
  )

  const handleSelectAnswer = (answer: string) => {
    setCurrentAnswer(answer)
  }
  return (
    <div className="border-2 border-black w-[1100px] h-[800px] mx-auto flex flex-col justify-center items-center p-6">
      <div className="flex w-full">
        <p className="text-3xl text-center">
          {question.current_question}/{question.total_questions}
        </p>
        <p className="text-3xl text-center grow">{question.title}</p>
      </div>

      <div className="grow flex flex-col justify-end items-center">
        <div className="grid grid-cols-2 gap-6">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={answer + index}
              type="button"
              className={`py-6 px-12 bg-orange-400 text-center border-4 ${
                currentAnswer === answer && 'border-black'
              }`}
              onClick={() => handleSelectAnswer(answer)}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Question
