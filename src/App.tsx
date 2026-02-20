import {PrimeReactProvider} from "primereact/api";
import {GameSetupProvider} from "./context/gameSetupContext";
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