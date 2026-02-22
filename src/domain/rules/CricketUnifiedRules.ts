import type {DartThrow} from "../dartTypes";
import type {UnifiedRules, UnifiedGameState} from "../model/UnifiedGameState";

export type CricketTarget = 20 | 19 | 18 | 17 | 16 | 15 | 25;

export type CricketOptions = {
    cutThroat: boolean; // vermutlich meinst du "Cut Throat"
};

export type CricketPlayer = {
    id: string;
    name: string;
    marks: Record<CricketTarget, number>;
    score: number;
    isWinner: boolean;
};

export const TARGETS: CricketTarget[] = [20, 19, 18, 17, 16, 15, 25];

export class CricketUnifiedRules implements UnifiedRules {
    name = "CRICKET";
    private options: CricketOptions;

    constructor(options: CricketOptions = {cutThroat: false}) {
        this.options = options;
    }

    initialPlayers(players: { id: string; name: string }[]): CricketPlayer[] {
        return players.map(p => ({
            ...p,
            marks: {20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, 25: 0},
            score: 0,
            isWinner: false
        }));
    }

    applyThrow(state: UnifiedGameState, dart: DartThrow): UnifiedGameState {
        let players = state.players.map(p => ({...p}));
        const current = players[state.currentPlayerIndex];

        const player = {...current, marks: {...current.marks}};

        const target = dart.value as CricketTarget;
        if (!TARGETS.includes(target)) return state;

        let hits = dart.multiplier;

        while (hits--) {
            if (player.marks[target] < 3) {
                player.marks[target]++;
            } else {
                if (this.options.cutThroat) {
                    players = players.map((p, i) => {
                        if (i === state.currentPlayerIndex) return p;
                        if (p.marks[target] < 3) {
                            return {...p, score: p.score + target};
                        }
                        return p;
                    })
                } else {
                    const opponentOpen = players.some(
                        (p, i) => i !== state.currentPlayerIndex && p.marks[target] < 3
                    );
                    if (opponentOpen) {
                        player.score += target;
                    }
                }
            }
        }

        players[state.currentPlayerIndex] = player;

        const allClosedByCurrent = TARGETS.every(t => player.marks[t] >= 3);

        const hasWinningScore = this.options.cutThroat
            ? players.every(p => p.score >= player.score)
            : players.every(p => p.score <= player.score);

        const finished = allClosedByCurrent && hasWinningScore;

        if (finished) {
            const finishedPlayers = players.map((p, i) => ({
                ...p,
                isWinner: i === state.currentPlayerIndex,
            }));
            return {...state, players: finishedPlayers, status: "GAME_FINISHED"};
        }

        return {
            ...state,
            players,
            currentPlayerIndex:
                (state.currentPlayerIndex + 1) % players.length,
        };
    }
}
