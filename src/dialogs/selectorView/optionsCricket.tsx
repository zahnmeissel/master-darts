import PlayerOptions from "./playerOptions";
import {Checkbox} from "primereact/checkbox";
import {useGameSetup} from "../../context/gameSetupContext.tsx";

export default function OptionsCricket() {
    const {state, dispatch} = useGameSetup();

    return (
        <div>
            <hr></hr>
            <PlayerOptions/>
            <div style={{paddingTop: '16px'}}>
                <Checkbox
                    inputId={"cutThroat"}
                    checked={state.cricketOptions.cutThroat}
                    onChange={(e) => dispatch({
                            type: "SET_CRICKET_OPTION",
                            key: "cutThroat",
                            value: !!e.checked,
                        }
                    )}>
                </Checkbox>
                <label htmlFor={"cutThroat"}
                style={{marginLeft: "8px"}}>Cut Throat</label>
            </div>
        </div>
    )
        ;
}