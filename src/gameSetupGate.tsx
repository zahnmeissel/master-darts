import type {GameSetupState} from "./context/gameSetupContext";
import {useGameSetup} from "./context/gameSetupContext";
import GameSelectorView from "./dialogs/selectorView/gameSelectorView";
import {GameProvider} from "./context/GameContext";
import type {UnifiedGameState} from "./domain/model/UnifiedGameState";
import {createCricketGame, createX01Game} from "./domain/CreateGameVariant";
import Cricket from "./game-variants/cricket/Cricket";
import {GameType} from "./lib/constants.ts";

export default function GameSetupGate() {
    const {state: setupState} = useGameSetup();

    if (setupState.status === "SETUP") {
        return <GameSelectorView />;
    }

    function assertNever(x: never): never {
        throw new Error(`Unexpected value: ${x}`);
    }

    function startGame(setup: GameSetupState): UnifiedGameState {
        ///dispatch({type: "START_GAME"});
        switch (setup.gameType) {
            case GameType.X01:
                return createX01Game(setup.players)
            case GameType.CRICKET:
                return createCricketGame(setup.players, setup.cricketOptions)
            case GameType.SHANGHAI:
                throw new Error("Shanghai not implemented yet");
            default:
                throw assertNever(setup.gameType);
        }
    }

    return (
        <GameProvider initialState={startGame(setupState)}>
            {
                <Cricket/>
            }
        </GameProvider>
    )
}