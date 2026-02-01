import type {CRICKET, gameVariantOptions} from "../../lib/constants.ts";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import type {GameVariant} from "./api/GameVariant";
import NewCricket from "./NewCricket";
import type GameProvider from "./../../context/GameContext";
import {createCricketGame} from "../../domain/CreateGameVariant";
import GameTypeSelect from "./gameTypeSelect";
import {useGameSetup} from "../../context/gameSetupContext";

type NewGameProps = {
	// Define any props if needed
	onStartNewGame: (gameVariant: GameVariant, playerNames: string[]) => void;
}

export default function GameSelectorView({onStartNewGame}: NewGameProps) {
	const {state, dispatch} = useGameSetup();

	return (
		<div className="gameboard">
			<GameTypeSelect />
			{/*
				selectedGame === CRICKET && <GameProvider initialState={createCricketGame()}>
				<NewCricket playerList = {players}/>
			</GameProvider>
			*/}
			<Button className="start-game-button" onClick={() => dispatch({type: "START_GAME"})}>Start Game</Button>
		</div>
	)
}