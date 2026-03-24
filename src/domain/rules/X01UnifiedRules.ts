import type { DartThrow } from "../dartTypes";
import type {UnifiedRules, UnifiedGameState, PlayerBase} from "../model/UnifiedGameState";
import type {X01Options} from "./OptionsTypes.ts";
import type {SetupPlayers} from "../../context/gameSetupContext.tsx";

export type X01Player = PlayerBase & {
  score: number;
};

export type X01VariantState = {
  x01Options: X01Options;
}

export class X01UnifiedRules implements UnifiedRules<X01Player, X01VariantState> {
  name = "X01";
  private readonly startScore: number;
  private readonly doubleOut: boolean;
  constructor(
    startScore: number,
    doubleOut: boolean
  ) {
    this.doubleOut = doubleOut;
    this.startScore = startScore;
  }

  initialPlayers(players: SetupPlayers[]): X01Player[] {
    return players.map(p => ({
      ...p,
      score: this.startScore,
      isWinner: false,
    }));
  }

  applyThrow(
      state: UnifiedGameState<X01Player, X01VariantState>,
      dart: DartThrow): UnifiedGameState<X01Player, X01VariantState>{
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
