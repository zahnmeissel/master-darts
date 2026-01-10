import {Button} from "primereact/button";
import {allScores, type GameProps} from "../../lib/constants.ts";
import TotalScore from "../cricket/TotalScore.tsx";
import {useState} from "react";
import ShanghaiScore from "./ShanghaiScore.tsx";

export default function Shanghai({player1Name, player2Name}: GameProps) {
	const [player1, setPlayer1] = useState<number[]>([]);
	const [player2, setPlayer2] = useState<number[]>([]);

	const [totalScore1, setTotalScore1] = useState(0);
	const [totalScore2, setTotalScore2] = useState(0);

	function incrementScore(score: number, index: number, playerId: number) {
		if (playerId === 1) {
			const newScores = [...player1];
			newScores[index] = score;
			setPlayer1(newScores);
		} else if (playerId === 2) {
			const newScores = [...player2];
			newScores[index] = score;
			setPlayer2(newScores);
		}
	}

	function isWinner(playerId: number): boolean {
		if (playerId === 1) {
			return false;
		} else if (playerId === 2) {
			return false;
		}
		return false;
	}

	return (
		<div className="gameboard">
			<header className="header">
				<div className={"info"}>
					<div>
						<h1>Shanghai Game</h1>
					</div>
					<div className="player-info">
						<div className="player-name">
							{player1Name}
						</div>
						<div className="player-switch-button">
							<Button icon="pi pi-arrow-right-arrow-left"/>
						</div>
						<div className="player-name">
							{player2Name}
						</div>
					</div>
				</div>
			</header>
			<div className="game">
				{allScores.map((score, index) => {
					return (
						<div className={`score-row`} key={index}>
							<ShanghaiScore index={index} disabled={false} playerId={1}
										   onIncrementScore={incrementScore}/>
							<div className="player-switch-button">
								{score}
							</div>
							<ShanghaiScore index={index} disabled={false} playerId={2}
										   onIncrementScore={incrementScore}/>
						</div>
					)
				})}
			</div>
			<footer className={"footer"}>
				<div className="player-info">
					<TotalScore
						score={totalScore1}
						isWinner={isWinner(1)}/>
					<div className="player-switch-button">

					</div>
					<TotalScore
						score={totalScore2}
						isWinner={isWinner(2)}/>
				</div>
			</footer>
		</div>
	);
}