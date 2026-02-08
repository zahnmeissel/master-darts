import {createContext, useContext, useReducer, useState, ReactNode} from "react";
import type {UnifiedGameState} from "../domain/model/UnifiedGameState";
import type {DartThrow} from "../domain/dartTypes";

export type GameAction =
    | { type: "START_GAME" }
    | { type: "THROW_DART"; dart: DartThrow }
    | { type: "RESET_GAME" }
    | { type: "SET_CURRENT_PLAYER_INDEX"; playerId: number};

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
        case "SET_CURRENT_PLAYER_INDEX":
            return {...state, currentPlayerIndex: action.playerId};
        default:
            return state;
    }
}

type GameDispatch = (action: GameAction) => void;

type GameContextValue = {
    gameState: UnifiedGameState;
    gameDispatch: (action: GameAction) => void;
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