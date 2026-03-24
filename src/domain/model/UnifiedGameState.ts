import type {DartThrow} from "../dartTypes";

export type PlayerBase = {
    id: string;
    name: string;
};

export type DeepReadOnly<T> =
    T extends (...args: any[]) => any ? T :
        T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepReadOnly<U>> :
            T extends object ? { readonly [K in keyof T]: DeepReadOnly<T[K]> } :
                T;

export type UnifiedGameState<
    P extends PlayerBase = PlayerBase,
    V extends object = {}
> = DeepReadOnly<{
    players: P[];
    currentPlayerIndex: number;
    status: "SETUP" | "RUNNING" | "GAME_FINISHED";
    rules: UnifiedRules<P, V>;
} & V>;

export interface UnifiedRules<P extends PlayerBase, V extends object> {
    name: string;

    initialPlayers(players: PlayerBase[]): P[];

    applyThrow(
        state: UnifiedGameState<P, V>,
        dart: DartThrow
    ): UnifiedGameState<P, V>;
}
