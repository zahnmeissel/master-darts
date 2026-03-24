import {createContext, useContext, useReducer} from "react";
import type {ReactNode} from "react";
import type {UnifiedGameState} from "../domain/model/UnifiedGameState";
import type {DartThrow} from "../domain/dartTypes";
import type {ShanghaiPlayer, ShanghaiVariantState} from "../domain/rules/ShanghaiUnifiedRules.ts";
import type {X01Player, X01VariantState} from "../domain/rules/X01UnifiedRules.ts";
import type {CricketPlayer, CricketVariantState} from "../domain/rules/CricketUnifiedRules.ts";

export type GameAction =
    | { type: "START_GAME" }
    | { type: "THROW_DART"; dart: DartThrow }
    | { type: "RESET_GAME" }
    | { type: "SET_CURRENT_PLAYER_INDEX"; playerIndex: number};

export type AnyGameState =
    | UnifiedGameState<CricketPlayer, CricketVariantState>
    | UnifiedGameState<X01Player, X01VariantState>
    | UnifiedGameState<ShanghaiPlayer, ShanghaiVariantState>;

function gameReducer(
    state: AnyGameState,
    action: GameAction
): AnyGameState {
    switch (action.type) {
        case "START_GAME":
            return {...state, status: "RUNNING"};
        case "THROW_DART":
            return state.rules.applyThrow(state as never, action.dart) as AnyGameState;
        case "RESET_GAME":
            return {...state, status: "SETUP"};
        case "SET_CURRENT_PLAYER_INDEX":
            return {...state, currentPlayerIndex: action.playerIndex};
        default:
            return state;
    }
}

type GameContextValue = {
    gameState: AnyGameState;
    gameDispatch: (action: GameAction) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
    initialState: AnyGameState;
    children: ReactNode;
}

export function GameProvider(
    {
        initialState,
        children
    }: GameProviderProps) {
    const [gameState, gameDispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ gameState, gameDispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within GameProvider");
    }
    return context;
}