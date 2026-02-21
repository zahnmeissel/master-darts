import {useGameSetup} from "../../context/gameSetupContext";
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';

export default function PlayerOptions() {
    const {state, dispatch} = useGameSetup();

    return (
        <div>
            <h3>Spieler wählen</h3>
            {
                state.players.map(player => (
                    <div key={player.id} style={{width: '100%'}}>
                        <div className={"add-player"}>
                            <InputText
                                key={player.id}
                                value={player.name}
                                onChange={e => dispatch({
                                    type: "RENAME_PLAYER",
                                    playerId: player.id,
                                    name: e.target.value
                                })}
                            />
                            <Button
                                onClick={() => dispatch({
                                    type: "REMOVE_PLAYER",
                                    playerId: player.id
                                })}
                                disabled={state.players.length < 3}
                                label={"-"}
                                severity={"warning"}/>
                        </div>
                    </div>
                ))
            }
            <Button
                onClick={() => dispatch({type: "ADD_PLAYER"})}
                label={"+"}
                severity={"secondary"}/>
        </div>
    );
}