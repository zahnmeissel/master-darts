import {GameType} from "../../lib/constants.ts";
import {Button} from "primereact/button";
import GameTypeSelect from "./gameTypeSelect";
import {useGameSetup} from "../../context/gameSetupContext";
import OptionsCricket from "./optionsCricket";

export default function GameSelectorView() {
    const {state, dispatch} = useGameSetup();

    function createGameTypeView(gameType: GameType) {
        if (gameType === GameType.CRICKET) {
            return (
                <OptionsCricket/>
            )
        }
    }

    return (
        <>
            <GameTypeSelect/>
            {
                createGameTypeView(state.gameType)
            }
            <div className="start-game-button">
                <Button
                    onClick={() => dispatch({type: "START_GAME"})}>Start Game</Button>
            </div>
        </>
    )
}