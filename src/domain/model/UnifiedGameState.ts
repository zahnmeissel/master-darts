import type { DartThrow } from "../dartTypes";

export type PlayerBase = {
  id: string;
  name: string;
};

export type UnifiedGameState = {
  players: any[];
  currentPlayerIndex: number;
  status: "SETUP" | "RUNNING" | "GAME_FINISHED";
  rules: UnifiedRules;
};

export interface UnifiedRules {
  name: string;
  initialPlayers(players: PlayerBase[]): any[];
  applyThrow(
    state: UnifiedGameState,
    dart: DartThrow
  ): UnifiedGameState;
}
