import type { DartThrow } from "../dartTypes";
import type { UnifiedRules, UnifiedGameState } from "../model/UnifiedGameState";

export type X01Player = {
  id: string;
  name: string;
  score: number;
};

export class X01UnifiedRules implements UnifiedRules {
  name = "X01";
  private startScore: number;
  private doubleOut: boolean;
  constructor(
    startScore: number,
    doubleOut: boolean
  ) {
    this.doubleOut = doubleOut;
    this.startScore = startScore;
  }

  initialPlayers(players: { id: string; name: string }[]): X01Player[] {
    return players.map(p => ({
      ...p,
      score: this.startScore,
    }));
  }

  applyThrow(state: UnifiedGameState, dart: DartThrow): UnifiedGameState {
    const players = [...state.players];
    const player = { ...players[state.currentPlayerIndex] };
    const hit = dart.value * dart.multiplier;
    const newScore = player.score - hit;

    if (newScore < 0) return state;

    if (newScore === 0 && this.doubleOut && dart.multiplier !== 2) {
      return state;
    }

    player.score = newScore;
    players[state.currentPlayerIndex] = player;

    if (newScore === 0) {
      return { ...state, players, status: "GAME_FINISHED" };
    }

    return {
      ...state,
      players,
      currentPlayerIndex:
        (state.currentPlayerIndex + 1) % players.length,
    };
  }
}
