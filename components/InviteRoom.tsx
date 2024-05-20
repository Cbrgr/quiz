import Avatar from "@/components/Avatar";
import { useState } from "react";

type Props = {
  onSubmitUsername: (username: string) => void;
};
const InviteRoom = ({ onSubmitUsername }: Props) => {
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const handleUsernameChange = (event: any) => {
    const value = event.target.value;
    setIsUsernameValid(value.trim() !== "");
    setUsername(value);
    console.log(value);
  };

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
        <div>
          <button
            disabled={!isUsernameValid}
            className="bg-blue-400 p-2 rounded-md"
            onClick={() => onSubmitUsername(username)}
          >
            Rejoindre la partie
          </button>
        </div>
      </div>
    </main>
  );
};
export default InviteRoom;
