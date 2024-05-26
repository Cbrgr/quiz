import { socket } from '@/socket'
import WaitingRoom from '@/components/WaitingRoom'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import InviteRoom from '@/components/InviteRoom'
import { UserType } from '@/utils/types/users'
import { GameDataType } from '@/utils/types/game'
import Game from '@/components/Game'

export default function Lobby() {
  const router = useRouter()

  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState('N/A')
  const [messages, setMessages] = useState<string[]>([])
  const [userList, setUserList] = useState<UserType[]>([])
  const [isInit, setIsInit] = useState<boolean>(false)
  const [game, setGame] = useState<GameDataType | undefined>(undefined)

  const onRoomMessage = (message: string) => {
    console.log('room message arrived')
    console.log(message)
    setMessages((prev) => [...prev, message])
  }

  const onUserList = (users: UserType[]) => {
    console.log('User list refreshed')
    setUserList(users)
  }

  const onStartGame = ({ gameMode, playerList }: GameDataType) => {
    console.log('onStartGame')
    console.log(gameMode)
    console.log(playerList)
    setGame({ gameMode, playerList })
  }

  const onEndGame = () => {
    setGame(undefined)
  }

  const onConnect = () => {
    console.log('socket.id')
    console.log(socket.id)
    setIsConnected(true)
    setTransport(socket.io.engine.transport.name)

    socket.io.engine.on('upgrade', (transport: any) => {
      setTransport(transport.name)
    })
  }

  const onDisconnect = () => {
    setIsConnected(false)
    setTransport('N/A')
  }

  const handleUserInit = (name: string) => {
    setIsInit(true)
    socket.emit('init_user', {
      roomId: router.query.gameId,
      username: name,
    })
  }

  useEffect(() => {
    if (router.isReady && socket.connected && router.query.username) {
      handleUserInit(`${router.query.username}`)
    }
  }, [router, socket.connected])

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('room_message', onRoomMessage)
    socket.on('user_list', onUserList)
    socket.on('start_game', onStartGame)
    socket.on('end_game', onEndGame)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('room_message', onRoomMessage)
      socket.off('user_list', onUserList)
      socket.off('start_game', onStartGame)
      socket.off('end_game', onEndGame)
    }
  }, [])

  // const onMessageChange = (event: React.FormEvent<HTMLInputElement>): void => {
  //   const message = event.currentTarget.value;
  //   setCurrentMessage(message);
  //   console.log("message");
  //   console.log(message);
  // };

  // const handleSumbitMessage = (): void => {
  //   socket.emit("room_message", { room: gameId, text: currentMessage });
  //   console.log("currentMessage");
  //   console.log(currentMessage);
  //   setCurrentMessage("");
  // };

  if (isInit) {
    if (game !== undefined) {
      return <Game gameMode={game.gameMode} />
    }
    return <WaitingRoom users={userList} roomId={`${router.query.gameId}`} />
  }
  return <InviteRoom onSubmitUsername={handleUserInit} />

  // return (
  //   <div className="flex flex-col justify-center items-center h-screen gap-20 p-24">
  //     <div>My Game: {router.query.gameId}</div>
  //     <div className="flex gap-20">
  //       {!username ? (
  //         <InviteRoom onSubmitUsername={handleUserInit} />
  //       ) : game !== undefined ? (
  //         <Game />
  //       ) : (
  //         <WaitingRoom users={userList} />
  //       )}

  //       {/* <div className="flex flex-col gap-1">
  //         <div className="bg-white grow">
  //           {messages.map((m, index) => (
  //             <div key={index}>{m}</div>
  //           ))}
  //         </div>
  //         <div className="flex items-center">
  //           <input
  //             type="text"
  //             onChange={onMessageChange}
  //             value={currentMessage}
  //           />
  //           <button onClick={handleSumbitMessage}>Envoyer</button>
  //         </div>
  //       </div> */}
  //     </div>
  //   </div>
  // );
}
