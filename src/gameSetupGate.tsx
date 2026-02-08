import type {GameSetupState} from "./context/gameSetupContext";
import {useGameSetup} from "./context/gameSetupContext";
import GameSelectorView from "./dialogs/selectorView/gameSelectorView";
import {GameProvider} from "./context/GameContext";
import type {UnifiedGameState} from "./domain/model/UnifiedGameState";
import {createCricketGame, createX01Game} from "./domain/CreateGameVariant";
import {GameType} from "./lib/constants";
import { Button } from 'primereact/button';
import Cricket from "./game-variants/cricket/Cricket";

export default function GameSetupGate() {
    const {state: setupState, dispatch} = useGameSetup();

    if (setupState.status === "SETUP") {
        return <GameSelectorView />;
    }

    function startGame(setup: GameSetupState): UnifiedGameState {
        switch (setup.gameType) {
            case GameType.X01:
                return createX01Game(setup.players)
            case GameType.CRICKET:
                return createCricketGame(setup.players)
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