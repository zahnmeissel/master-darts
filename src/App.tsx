import {PrimeReactProvider} from "primereact/api";
import {GameSetupProvider} from "./context/gameSetupContext";
import GameSetupGate from "./gameSetupGate";


function App() {

    return (
        <PrimeReactProvider>
            <GameSetupProvider>
                <div className={"wrapper"}>
                    <GameSetupGate />
                </div>
            </GameSetupProvider>
        </PrimeReactProvider>
    )
}

export default App