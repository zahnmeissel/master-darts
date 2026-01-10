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
	const [gameProps, setGameProps] = useState<GameProps>({player1Name: "Player 1", player2Name: "Player 2"});

	function onStartNewGame(gameVariant: GameVariant, player1: string, player2: string) {
		setShowNewGameDialog(false);
		setGameVariant(gameVariant);
		setGameProps({player1Name: player1, player2Name: player2});
	}

	return (
		<PrimeReactProvider>
			{showNewGameDialog && <NewGame onStartNewGame={onStartNewGame}></NewGame>}
			{!showNewGameDialog && gameVariant === CRICKET &&
              <Cricket
                player1Name={gameProps.player1Name}
                player2Name={gameProps.player2Name}/>}
			{!showNewGameDialog && gameVariant === SHANGHAI &&
              <Shanghai
                player1Name={gameProps.player1Name}
                player2Name={gameProps.player2Name}/>}
		</PrimeReactProvider>
	)
}

export default App