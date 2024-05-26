import { GameMode } from '@/utils/types/game'
import GamemodeQCM from './components/GamemodeQCM'

type Props = {
  gameMode: GameMode
}

const Game = ({ gameMode }: Props) => {
  const displayGameMode = () => {
    if (gameMode === GameMode.QCM) {
      return <GamemodeQCM />
    }
  }

  return (
    <div>
      <p>GAME</p>
      <div>{gameMode}</div>
      {displayGameMode()}
    </div>
  )
}
export default Game
