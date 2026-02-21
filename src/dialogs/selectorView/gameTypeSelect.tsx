import {useGameSetup} from "../../context/gameSetupContext";
import {gameVariantOptions} from "../../lib/constants";
import type {GameType} from "../../lib/constants";
import {Dropdown} from 'primereact/dropdown';
import '../../styles/base.scss';

export default function GameTypeSelect() {
    const {state, dispatch} = useGameSetup();

    return (
        <div className={"header"}>

            <h1>Master Darts</h1>
            <p>Wähle welche Spielart Du trainieren möchtest</p>

            <Dropdown style={{width: '100%'}}
                options={gameVariantOptions}
                optionLabel={"name"}
                optionValue={"type"}
                value={state.gameType}
                onChange={e => dispatch({
                    type: "SET_GAME_TYPE",
                    gameType: e.value as GameType
                })}
            />

        </div>
    );
}