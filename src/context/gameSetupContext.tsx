import {createContext, useContext, useReducer, useEffect} from "react";
import type {ReactNode} from "react";
import {GameType} from "../lib/constants";
import {v4 as uuidv4} from "uuid";
import type {CricketOptions, GameOptionsByType, ShanghaiOptions} from "../domain/rules/OptionsTypes.ts";
import type {X01Options} from "../domain/rules/X01Rules.ts";

//STORAGE
const STORAGE_KEY = "dart-game-setup";

function loadSetupState(): GameSetupState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return createInitialSetupState();

        const parsed = JSON.parse(raw) as Partial<GameSetupState>;

        const gameType = (parsed.gameType ?? GameType.CRICKET) as GameType;
        const base = createInitialSetupState(gameType);

        return {
            ...base,
            ...parsed,
            players: parsed.players && parsed.players.length >= 2 ? parsed.players : base.players,
            options: {
                ...(base as any).options,
                ...(parsed as any).options,
            }
        } as GameSetupState;

    } catch {
        return createInitialSetupState();
    }
}

export type SetupPlayers = {
    id: string;
    name: string;
    options?: Record<string, number>;
};

type SetupBase = {
    status: "SETUP" | "RUNNING";
    players: SetupPlayers[];
};

export type GameSetupState =
    | (SetupBase & {
    gameType: typeof GameType.CRICKET; options: CricketOptions
})
    | (SetupBase & {
    gameType: typeof GameType.SHANGHAI; options: ShanghaiOptions
})
    | (SetupBase & {
    gameType: typeof GameType.X01; options: X01Options
});

type CricketSetOptionAction = {
    [K in keyof GameOptionsByType[typeof GameType.CRICKET]]: {
        type: "SET_OPTION";
        gameType: typeof GameType.CRICKET;
        key: K;
        value: GameOptionsByType[typeof GameType.CRICKET][K];
    }
}[keyof GameOptionsByType[typeof GameType.CRICKET]];

type ShanghaiSetOptionAction = {
    [K in keyof GameOptionsByType[typeof GameType.SHANGHAI]]: {
        type: "SET_OPTION";
        gameType: typeof GameType.SHANGHAI;
        key: K;
        value: GameOptionsByType[typeof GameType.SHANGHAI][K];
    }
}[keyof GameOptionsByType[typeof GameType.SHANGHAI]];

type X01SetOptionAction = {
    [K in keyof GameOptionsByType[typeof GameType.X01]]: {
        type: "SET_OPTION";
        gameType: typeof GameType.X01;
        key: K;
        value: GameOptionsByType[typeof GameType.X01][K];
    }
}[keyof GameOptionsByType[typeof GameType.X01]];

export type GameSetupAction =
    | { type: "START_GAME" }
    | { type: "SET_GAME_TYPE"; gameType: GameType }
    | { type: "ADD_PLAYER" }
    | { type: "REMOVE_PLAYER"; playerId: string }
    | { type: "RENAME_PLAYER"; playerId: string; name: string }
    | { type: "RESET_SETUP" }
    | CricketSetOptionAction
    | ShanghaiSetOptionAction
    | X01SetOptionAction;

const defaultOptions: GameOptionsByType = {
    [GameType.CRICKET]: {cutThroat: false},
    [GameType.SHANGHAI]: {includeBull: false},
    [GameType.X01]: {startScore: 501, outRule: "DOUBLE_OUT", legsPerSet: 5, sets: 1},
};

function createInitialSetupState(gameType: GameType = GameType.CRICKET): GameSetupState {
    return {
        status: "SETUP",
        gameType,
        players: [
            {id: uuidv4(), name: "Spieler 1"},
            {id: uuidv4(), name: "Spieler 2"}
        ],
        options: defaultOptions[gameType],
    } as GameSetupState;
}

function gameSetupReducer(
    state: GameSetupState,
    action: GameSetupAction
): GameSetupState {
    switch (action.type) {
        case "START_GAME":
            return {...state, status: "RUNNING"};
        case "SET_GAME_TYPE": {
            const next = createInitialSetupState(action.gameType);
            return {...next, players: state.players};
        }
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
            return createInitialSetupState(state.gameType);
        case "SET_OPTION":
            if (action.gameType !== state.gameType) return state;
            switch (state.gameType) {
                case GameType.CRICKET:
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            [action.key]: action.value,
                        },
                    };

                case GameType.SHANGHAI:
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            [action.key]: action.value,
                        },
                    };

                case GameType.X01:
                    return {
                        ...state,
                        options: {
                            ...state.options,
                            [action.key]: action.value,
                        },
                    };

                default:
                    return state;
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