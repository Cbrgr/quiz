import { socket } from '@/socket'
import { UserType } from '@/utils/types/users'
import { useState } from 'react'

type Props = {
  users: UserType[]
  roomId?: string
}

const WaitingRoom = ({ users, roomId }: Props) => {
  const gameModes = [
    { label: 'qcm', title: 'Partie QCM' },
    { label: 'classic', title: 'Partie classique' },
    { label: 'fast', title: 'Partie rapide' },
    { label: 'lol', title: 'Partie lol' },
    { label: 'bla', title: 'Partie bla' },
  ]

  const [selectedGameMode, setSelectedGameMode] = useState<string>(
    gameModes[0].label
  )

  const handleStartGame = () => {
    console.log('handleStartGame')
    socket.emit('start_game', { gameMode: selectedGameMode, roomId })
  }

  return (
    <div className="flex flex-col items-center gap-20">
      <div className="bg-orange-500 p-10">Logo</div>
      <div className="flex gap-20">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <div
                className={`text-center p-1 bg-blue-300 border-2 ${
                  socket.id === user.id ? 'border-black' : 'border-transparent'
                }`}
                key={user.id}
              >
                {user.username}
              </div>
            ))}
          </div>

          <button className="w-full p-2 bg-orange-500">Mode spectateur</button>
        </div>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-5">
            {gameModes.map((m) => {
              const isSelected = selectedGameMode === m.label
              return (
                <div
                  key={m.label}
                  className={`h-[100px] p-2 bg-cyan-500 flex items-center justify-center border-4 cursor-pointer ${
                    isSelected ? 'border-red-500 bg-white' : ''
                  }`}
                  onClick={() => setSelectedGameMode(m.label)}
                >
                  {m.title}
                </div>
              )
            })}
          </div>
          <div className="flex gap-5 justify-center items-center">
            <button type="button" className="bg-blue-500 p-2">
              Inviter
            </button>
            <button
              type="button"
              className="bg-blue-500 p-2"
              onClick={handleStartGame}
            >
              Démarrer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom
