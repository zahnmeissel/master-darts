import {InputText} from "primereact/inputtext";
import {CRICKET, gameVariantOptions} from "../../lib/constants.ts";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import type {GameVariant} from "./api/GameVariant";

type NewGameProps = {
	// Define any props if needed
	onStartNewGame: (gameVariant: GameVariant, players: string[]) => void;
}
export default function NewGame({onStartNewGame}: NewGameProps) {
	const [selectedGame, setSelectedGame] = useState<GameVariant>(CRICKET);
	const [player1Name, setPlayer1Name] = useState("Player 1");
	const [player2Name, setPlayer2Name] = useState("Player 2");

	const handleOnClick = () => {
		// Handle the start game logic here
		console.log("Game started!");
		if (selectedGame) {
			console.log(`Starting game: ${selectedGame} with players: ${player1Name} and ${player2Name}`);
			onStartNewGame(selectedGame, [player1Name, player2Name]);
		}
	}

	return (
		<div className="gameboard">
			<h1>New Game</h1>
			<p>Welcome to the new game setup!</p>
			<p>Here you can configure your game settings.</p>
			<Dropdown
				options={gameVariantOptions}
				optionLabel={"name"}
				value={selectedGame}
				onChange={(e) => setSelectedGame(e.value)}
			/>
			<label htmlFor="player1">Name player 1</label>
			<InputText
				value={player1Name}
				id="player1"
				type="text"
				placeholder="Player 1"
				onChange={(e) => setPlayer1Name(e.target.value)}/>
			<label htmlFor="player2">Name Player 2</label>
			<InputText
				value={player2Name}
				id="player2"
				type="text"
				placeholder="Player 2"
				onChange={(e) => setPlayer2Name(e.target.value)}/>
			{selectedGame.maxPlayers > 2 && <Button icon="pi pi-plus"></Button>}
			<Button className="start-game-button" onClick={handleOnClick}>Start Game</Button>
		</div>
	)
}