import { UserType } from "./users";

export enum GameMode {
  QCM = "qcm",
  Standard = "standard"
}

export type GameDataType = {
  gameMode: GameMode;
  playerList: UserType[];
};
