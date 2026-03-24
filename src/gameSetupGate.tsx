import {type GameSetupState, useGameSetup} from "./context/gameSetupContext";
import GameSelectorView from "./dialogs/selectorView/gameSelectorView";
import {GameProvider} from "./context/GameContext";
import {createCricketGame, createShanghaiGame, createX01Game} from "./domain/CreateGameVariant";
import Cricket from "./game-variants/cricket/Cricket";
import {GameType} from "./lib/constants.ts";
import X01 from "./game-variants/x01/X01.tsx";
import Shanghai from "./game-variants/shanghai/Shanghai.tsx";

export default function GameSetupGate() {
    const {state: setupState} = useGameSetup();

    if (setupState.status === "SETUP") {
        return <GameSelectorView/>;
    }

    function startGame(setup: GameSetupState) {
        switch (setup.gameType) {
            case GameType.X01:
                return createX01Game(setup.players, setup.options)
            case GameType.CRICKET:
                return createCricketGame(setup.players, setup.options)
            case GameType.SHANGHAI:
                return createShanghaiGame(setup.players, setup.options);
            default:
                throw new Error(`Unexpected value: `);
        }
    }

    return (
        <GameProvider initialState={startGame(setupState)}>
            {setupState.gameType === GameType.CRICKET && <Cricket/>}
            {setupState.gameType === GameType.SHANGHAI && <Shanghai/>}
            {setupState.gameType === GameType.X01 && <X01/>}
        </GameProvider>
    )
}