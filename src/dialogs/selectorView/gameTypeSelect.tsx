import {useGameSetup} from "../../context/gameSetupContext";
import {gameVariantOptions} from "../../lib/constants";
import type {GameType} from "../../lib/constants";
import { Dropdown } from 'primereact/dropdown';

export default function GameTypeSelect() {
    const {state, dispatch} = useGameSetup();

    return (
        <>
            <h1>New Game</h1>
            <p>Welcome to the new game setup!</p>
            <p>Here you can configure your game settings.</p>
            <Dropdown
                options={gameVariantOptions}
                optionLabel={"name"}
                optionValue={"type"}
                value={state.gameType}
                onChange={e => dispatch({
                    type: "SET_GAME_TYPE",
                    gameType: e.value as GameType
                })}
            />

        </>
    );
}