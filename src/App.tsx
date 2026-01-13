import NewGame from "./dialogs/new-game/NewGame.tsx";
import {PrimeReactProvider} from "primereact/api";
import Cricket from "./game-variants/cricket/Cricket.tsx";
import Shanghai from "./game-variants/shanghai/Shanghai.tsx";
import {useState} from "react";
import {type GameProps, SHANGHAI, CRICKET} from "./lib/constants.ts";
import type {GameVariant} from "./api/GameVariant.ts";


function App() {

	const [showNewGameDialog, setShowNewGameDialog] = useState(true);
	const [gameVariant, setGameVariant] = useState<GameVariant>(SHANGHAI);
	const [gameProps, setGameProps] = useState<GameProps>({players: ["Player 1", "Player 2"]});

	function onStartNewGame(gameVariant: GameVariant, players: string[]) {
		setGameProps({players});
		setShowNewGameDialog(false);
		setGameVariant(gameVariant);
	}

	function GameVariant() {
		if (gameVariant === CRICKET) {
			return <Cricket players={gameProps.players}/>
		} else if (gameVariant === SHANGHAI) {
			return <Shanghai players={gameProps.players}/>
		} else
			return null;
	}
	return (
		<PrimeReactProvider>
			{showNewGameDialog && <NewGame onStartNewGame={onStartNewGame}></NewGame>}

			{!showNewGameDialog && <GameVariant/>}
		</PrimeReactProvider>
	)
}

export default App