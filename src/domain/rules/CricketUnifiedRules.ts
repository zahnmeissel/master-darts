import type { DartThrow } from "../dartTypes";
import type { UnifiedRules, UnifiedGameState } from "../model/UnifiedGameState";

type CricketTarget = 20 | 19 | 18 | 17 | 16 | 15 | 25;

export type CricketPlayer = {
  id: string;
  name: string;
  marks: Record<CricketTarget, number>;
  score: number;
};

const TARGETS: CricketTarget[] = [20, 19, 18, 17, 16, 15, 25];

export class CricketUnifiedRules implements UnifiedRules {
  name = "CRICKET";

  initialPlayers(players: { id: string; name: string }[]): CricketPlayer[] {
    return players.map(p => ({
      ...p,
      marks: { 20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, 25: 0 },
      score: 0,
    }));
  }

  applyThrow(state: UnifiedGameState, dart: DartThrow): UnifiedGameState {
    const players = [...state.players];
    const player = { ...players[state.currentPlayerIndex] };
    const target = dart.value as CricketTarget;

    if (!TARGETS.includes(target)) return state;

    let hits = dart.multiplier;

    while (hits--) {
      if (player.marks[target] < 3) {
        player.marks[target]++;
      } else {
        const opponentOpen = players.some(
          (p, i) => i !== state.currentPlayerIndex && p.marks[target] < 3
        );
        if (opponentOpen) player.score += target;
      }
    }

    players[state.currentPlayerIndex] = player;

    const finished =
      TARGETS.every(t => player.marks[t] >= 3) &&
      players.every(p => p.score <= player.score);

    if (finished) {
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
