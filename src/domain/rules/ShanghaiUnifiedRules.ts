import type { DartThrow } from "../dartTypes";
import type {UnifiedRules, UnifiedGameState, PlayerBase} from "../model/UnifiedGameState";
import type {ShanghaiOptions} from "./OptionsTypes.ts";

export type ShanghaiPlayer = PlayerBase & {
    score: number;
    isWinner: boolean;
};

export type ShanghaiTurn = {
    round: number; // 1..20 (oder 21 = Bull)
    dartInTurn: number; // 0..2
    hitSingle: boolean;
    hitDouble: boolean;
    hitTriple: boolean;
};

export type ShanghaiVaraiantState = {
    shanghaiTurn: ShanghaiTurn;
    shanghaiOptions: ShanghaiOptions;
}

export type ShanghaiGameState = UnifiedGameState<ShanghaiPlayer, ShanghaiVaraiantState>;

// Hilfsfunktion: Ziel der aktuellen Runde
function getRoundTarget(round: number, options: ShanghaiOptions): number {
    if (options.includeBull && round === 21) return 25;
    return round; // 1..20
}

// Hilfsfunktion: max Runde
function maxRound(options: ShanghaiOptions): number {
    return options.includeBull ? 21 : 20;
}

export class ShanghaiUnifiedRules implements UnifiedRules<ShanghaiPlayer, ShanghaiVaraiantState> {
    name = "SHANGHAI";
    private options: ShanghaiOptions;

    constructor(options: ShanghaiOptions = { includeBull: false }) {
        this.options = options;
    }

    initialPlayers(players: PlayerBase[]): ShanghaiPlayer[] {
        return players.map(p => ({
            ...p,
            score: 0,
            isWinner: false,
        }));
    }

    applyThrow(
        state: UnifiedGameState<ShanghaiPlayer, ShanghaiVaraiantState>,
        dart: DartThrow): UnifiedGameState<ShanghaiPlayer, ShanghaiVaraiantState> {

        const players = state.players.map(p => ({ ...p })) as ShanghaiPlayer[];
        const currentIndex = state.currentPlayerIndex;
        const current = players[currentIndex];

        // Turn-Tracking kopieren (immutable)
        const turn = { ...state.shanghaiTurn };

        const roundTarget = getRoundTarget(turn.round, this.options);

        // Treffer zählt nur, wenn Value == Rundenziel (bei Bull: 25)
        const isHitOnTarget = dart.value === roundTarget;

        if (isHitOnTarget) {
            // Score: target * multiplier
            current.score += roundTarget * dart.multiplier;

            // Shanghai-Progress in dieser Runde
            if (dart.multiplier === 1) turn.hitSingle = true;
            if (dart.multiplier === 2) turn.hitDouble = true;
            if (dart.multiplier === 3) turn.hitTriple = true;
        }

        // Dart verbrauchen
        turn.dartInTurn += 1;

        // Shanghai Sofortsieg?
        const shanghai = turn.hitSingle && turn.hitDouble && turn.hitTriple;
        if (shanghai) {
            const finishedPlayers = players.map((p, i) => ({
                ...p,
                isWinner: i === currentIndex,
            }));
            return {
                ...state,
                players: finishedPlayers,
                status: "GAME_FINISHED",
                shanghaiTurn: turn,
            };
        }

        // Turn-Ende nach 3 Darts: Spielerwechsel oder Rundenwechsel
        if (turn.dartInTurn >= 3) {
            // next player
            const nextPlayerIndex = (currentIndex + 1) % players.length;

            // wenn wieder Spieler 0 dran ist, beginnt neue Runde
            const isNewRound = nextPlayerIndex === 0;

            const nextRound = isNewRound ? turn.round + 1 : turn.round;

            // Runde fertig?
            if (nextRound > maxRound(this.options)) {
                // Game finished: highest score wins (bei tie: alle false oder mehrere Gewinner möglich)
                const maxScore = Math.max(...players.map(p => p.score));
                const winners = players.map(p => ({ ...p, isWinner: p.score === maxScore }));

                return {
                    ...state,
                    players: winners,
                    status: "GAME_FINISHED",
                    currentPlayerIndex: nextPlayerIndex,
                    shanghaiTurn: {
                        round: Math.min(nextRound, maxRound(this.options)),
                        dartInTurn: 0,
                        hitSingle: false,
                        hitDouble: false,
                        hitTriple: false,
                    },
                };
            }

            return {
                ...state,
                players,
                currentPlayerIndex: nextPlayerIndex,
                shanghaiTurn: {
                    round: nextRound,
                    dartInTurn: 0,
                    hitSingle: false,
                    hitDouble: false,
                    hitTriple: false,
                },
            };
        }

        // Normaler Return: gleicher Spieler, gleiche Runde, nächster Dart
        players[currentIndex] = current;

        return {
            ...state,
            players,
            shanghaiTurn: turn,
        };
    }
}