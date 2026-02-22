import {createContext, useContext, useReducer, useEffect} from "react";
import type {ReactNode} from "react";
import { GameType} from "../lib/constants";
import { v4 as uuidv4 } from "uuid";
import type {CricketOptions} from "../domain/rules/CricketUnifiedRules.ts";

//STORAGE
const STORAGE_KEY = "dart-game-setup";

function loadSetupState(): GameSetupState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return initialSetupState;

        const parsed = JSON.parse(raw) as GameSetupState;

        return {
            ...initialSetupState,
            ...parsed,
            players:
            parsed.players && parsed.players.length >= 2
            ? parsed.players
                : initialSetupState.players,
            cricketOptions: {
                ...initialSetupState.cricketOptions,
                ...(parsed.cricketOptions ?? {}),
            }
        };

    } catch {
        return initialSetupState;
    }
}

export type GameSetupState = {
    gameType: GameType;
    status: "SETUP" | "RUNNING";
    players: {
        id: string;
        name: string;
        options?: Record<string, number>;
    }[];
    cricketOptions: CricketOptions;
};

export type GameSetupAction =
    | { type: "START_GAME" }
    | { type: "SET_GAME_TYPE"; gameType: GameType }
    | { type: "ADD_PLAYER" }
    | { type: "REMOVE_PLAYER"; playerId: string }
    | { type: "RENAME_PLAYER"; playerId: string; name: string }
    | { type: "RESET_SETUP" }
    | { type: "SET_CRICKET_OPTION"; key: keyof CricketOptions; value: boolean};

export const initialSetupState: GameSetupState = {
    gameType: GameType.CRICKET,
    status: "SETUP",
    players: [
        {id: uuidv4(), name: "Spieler 1"},
        {id: uuidv4(), name: "Spieler 2"}
    ],
    cricketOptions: {
        cutThroat: false,
    }
};

function gameSetupReducer(
    state: GameSetupState,
    action: GameSetupAction
): GameSetupState {
    switch (action.type) {
        case "START_GAME":
            return {...state, status: "RUNNING"};
        case "SET_GAME_TYPE":
            return {...state, gameType: action.gameType};
        case "ADD_PLAYER":
            return {
                ...state,
                players: [
                    ...state.players,
                    {
                        id: uuidv4(),
                        name: `Spieler ${state.players.length + 1}`
                    }
                ]
            };
        case "REMOVE_PLAYER":
            return {
                ...state,
                players: state.players.filter(p => p.id !== action.playerId)
            };
        case "RENAME_PLAYER":
            return {
                ...state,
                players: state.players.map(p =>
                    p.id === action.playerId ? {...p, name: action.name} : p)
            };
        case "RESET_SETUP":
            return initialSetupState;
        case "SET_CRICKET_OPTION":
            return {
                ...state,
                cricketOptions: {
                    ...state.cricketOptions,
                    [action.key]: action.value,
                }
            }
        default:
            return state;
    }
}

type GameSetupContextValue = {
    state: GameSetupState;
    dispatch: (action: GameSetupAction) => void;
};

const GameSetupContext = createContext<GameSetupContextValue | null>(null);

export function GameSetupProvider({children}: { children: ReactNode }) {
    const [state, dispatch] = useReducer(
        gameSetupReducer,
        undefined,
        loadSetupState
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    return (
        <GameSetupContext.Provider value={{state, dispatch}}>
            {children}
        </GameSetupContext.Provider>
    );
}

export function useGameSetup() {
    const context = useContext(GameSetupContext);
    if (!context) {
        throw new Error("useGameSetup must be used within GameSetupProvider");
    }
    return context;
}