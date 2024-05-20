import Avatar from "@/components/Avatar"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"

export default function Home() {
  const randomGameId = useMemo(() => Math.floor(Math.random() * 10000), [])
  const [friendGameId, setFriendGameId] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isUsernameValid, setIsUsernameValid] = useState(false)

  const router = useRouter()

  const handleUsernameChange = (event: any) => {
    const value = event.target.value
    setIsUsernameValid(value.trim() !== "")
    setUsername(value)
    console.log(value)
  }

  const handleGameIdChange = (event: any) => {
    const value = event.target.value
    setFriendGameId(value)
    console.log(value)
  }

  const handleCreateGame = (): void => {
    if (!isUsernameValid) return
    router.push(
      {
        pathname: `/game/${randomGameId}`,
        query: { username: username.trim() }
      },
      `/game/${randomGameId}`
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-20 p-24">
      <div className="bg-orange-500 p-10">Logo</div>
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-10">
          <Avatar />
          <div className="flex flex-col gap-5">
            <p>Text introduction</p>
            <input
              type="text"
              name="username"
              placeholder="Pseudo"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex">
            <input
              type="text"
              placeholder="Entrer un code"
              value={friendGameId}
              onChange={handleGameIdChange}
            />
            <a className="bg-blue-400 p-2 rounded-md" href={`/${friendGameId}`}>
              OK
            </a>
          </div>
          <button
            disabled={!isUsernameValid}
            className="bg-blue-400 p-2 rounded-md"
            onClick={handleCreateGame}
          >
            Créer une partie
          </button>
        </div>
      </div>
    </main>
  )
}
