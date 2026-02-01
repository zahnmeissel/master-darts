import {useGameSetup} from "../../context/gameSetupContext";
import {GameType, gameVariantOptions} from "../../lib/constants";
import { Dropdown } from 'primereact/dropdown';

export default function GameTypeSelect() {
    const {state, dispatch} = useGameSetup();

    return (
        <>
            <h1>New Game</h1>
            <p>Welcome to the new game setup!</p>
            <p>Here you can configure your game settings.</p>
            <select
                value={state.gameType}
                onChange={e => dispatch({
                    type: "SET_GAME_TYPE",
                    gameType: e.target.value as GameType
                })}
            >
                <option value={"X01"}>X01</option>
                <option value={"CRICKET"}>Cricket</option>
            </select>
            <Dropdown
                options={gameVariantOptions}
                optionLabel={"name"}
                optionValue={"type"}
                value={state.gameType}
                onChange={e => dispatch({
                    type: "SET_GAME_TYPE",
                    gameType: e.target.value as GameType
                })}
            />

        </>
    );
}