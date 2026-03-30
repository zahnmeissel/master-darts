import {GameType} from "../../lib/constants.ts";
import {Button} from "primereact/button";
import GameTypeSelect from "./gameTypeSelect";
import {useGameSetup} from "../../context/gameSetupContext";
import OptionsCricket from "./OptionsCricket.tsx";
import OptionsX01 from "./OptionsX01.tsx";
import OptionsShanghai from "./OptionsShanghai.tsx";

export default function GameSelectorView() {
    const {state, dispatch} = useGameSetup();

    return (
        <>
            <GameTypeSelect/>
            {state.gameType === GameType.X01 && <OptionsX01/>}
            {state.gameType === GameType.CRICKET && <OptionsCricket/>}
            {state.gameType === GameType.SHANGHAI && <OptionsShanghai/>}
            <div className="start-game-button">
                <Button
                    onClick={() => dispatch({type: "START_GAME"})}>Start Game</Button>
            </div>
        </>
    )
}