import type {DartThrow} from "../dartTypes";

export type PlayerBase = {
    id: string;
    name: string;
};

export type DeepReadOnly<T> =
    T extends (...args: any[]) => any ? T :
        T extends object ? { readonly [K in keyof T]: DeepReadOnly<T[K]> } :
            T;

export type UnifiedGameState = DeepReadOnly<{
    players: any[];
    currentPlayerIndex: number;
    status: "SETUP" | "RUNNING" | "GAME_FINISHED";
    rules: UnifiedRules;
}>;

export interface UnifiedRules {
    name: string;

    initialPlayers(players: PlayerBase[]): any[];

    applyThrow(
        state: UnifiedGameState,
        dart: DartThrow
    ): UnifiedGameState;
}
