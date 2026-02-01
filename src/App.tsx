import {PrimeReactProvider} from "primereact/api";
import Cricket from "./game-variants/cricket/Cricket.tsx";
import Shanghai from "./game-variants/shanghai/Shanghai.tsx";
import {useState} from "react";
import {type GameProps, type SHANGHAI, type CRICKET} from "./lib/constants.ts";
import type {GameVariant} from "./api/GameVariant.ts";
import GameSelectorView from "./dialogs/selectorView/gameSelectorView";
import {GameSetupProvider} from "./context/gameSetupContext";
import type {GameSetupState} from "./context/gameSetupContext";
import type {UnifiedGameState} from "./domain/model/UnifiedGameState";
import {createCricketGame, createX01Game} from "./domain/CreateGameVariant";
import {GameProvider} from "./context/GameContext";
import GameSetupGate from "./gameSetupGate";


function App() {

    /*
    * Reset (neues Spiel starten) explizit steuern
    * <button onClick={() => dispatch({type: "RESET_SETUP"})}
    * */
    return (
        <PrimeReactProvider>
            <GameSetupProvider>
                <GameSetupGate />
            </GameSetupProvider>
        </PrimeReactProvider>
    )
}

export default App