import {createContext, useContext, useReducer, useState, ReactNode} from "react";
import type {UnifiedGameState} from "../domain/model/UnifiedGameState";
import type {DartThrow} from "../domain/dartTypes";

export type GameAction =
    | { type: "START_GAME" }
    | { type: "THROW_DART"; dart: DartThrow }
    | { type: "RESET_GAME" };

function gameReducer(
    state: UnifiedGameState,
    action: GameAction
): UnifiedGameState {
    switch (action.type) {
        case "START_GAME":
            return {...state, status: "RUNNING"};
        case "THROW_DART":
            return state.rules.applyThrow(state, action.dart);
        case "RESET_GAME":
            return {...state, status: "SETUP"};
        default:
            return state;
    }
}

type GameDispatch = (action: GameAction) => void;

type GameContextValue = {
    state: UnifiedGameState;
    dispatch: (action: GameAction) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
    initialState: UnifiedGameState;
    children: ReactNode;
}

export function GameProvider(
    {
        initialState,
        children
    }: GameProviderProps) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
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