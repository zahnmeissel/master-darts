import {CRICKET, gameVariantOptions} from "../../lib/constants.ts";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import type {GameVariant} from "./api/GameVariant";
import NewCricket from "./NewCricket";

type NewGameProps = {
	// Define any props if needed
	onStartNewGame: (gameVariant: GameVariant, playerNames: string[]) => void;
}

export default function NewGame({onStartNewGame}: NewGameProps) {
	const [selectedGame, setSelectedGame] = useState<GameVariant>(CRICKET);
	const [players, setPlayers] = useState<PlayerList>(["Player 1", "Player 2"]);

	const handleOnClick = () => {
		// Handle the start game logic here
		console.log("Game started!");
		if (selectedGame) {
			console.log(`Starting game: ${selectedGame} with players: ${players}`);
			onStartNewGame(selectedGame, [players]);
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
			{selectedGame === CRICKET && <NewCricket playerList = {players}/>}
			<Button className="start-game-button" onClick={handleOnClick}>Start Game</Button>
		</div>
	)
}