import {Button} from "primereact/button";
import {type GameProps, cricketGameScores, cricketGameScoresAsNumbers} from "../../lib/constants.ts";
import {useState} from "react";
import TotalScore from "./TotalScore.tsx";
import HitScore from "../components/HitScore.tsx";

export default function Cricket({players}: GameProps) {

	const [player1, setPlayer1] = useState([0, 0, 0, 0, 0, 0, 0]);
	const [player2, setPlayer2] = useState([0, 0, 0, 0, 0, 0, 0]);
	const [totalScore1, setTotalScore1] = useState(0);
	const [totalScore2, setTotalScore2] = useState(0);

	/*TODO:
	 * - Add a reset button toreset the game
	 * - Add a button to switch players
	 * - Add a button to select next player
	 * - Add a button to end the game
	 * - Add a button to save the game
	 * - Add a button to load a saved game
	 * - Add a button to show the rules of the game
	 * - Add a button to show the statistics of the game
	 * - Add a button to show the history of the game
	* */
	function incrementScore(score: number, index: number, playerId: number) {
		if (playerId === 1) {
			const newScores = [...player1];
			newScores[index] = score;
			setTotalScore1(calculateTotalScore(newScores));
			setPlayer1(newScores);
		} else if (playerId === 2) {
			const newScores = [...player2];
			newScores[index] = score;
			setTotalScore2(calculateTotalScore(newScores));
			setPlayer2(newScores);
		}
	}

	function isDisabled(index: number): boolean {
		return player1[index] >= 3 && player2[index] >= 3;
	}

	function calculateTotalScore(scores: number[]) {
		let total = 0;
		scores.forEach((value, index) => {
			if (value > 3) {
				const targetScoreValue = cricketGameScoresAsNumbers[index];
				total += targetScoreValue * (value - 3);
			}
		});
		return total;
	}

	function isWinner(playerId: number): boolean {
		if (playerId === 1) {
			const result = player1.filter(value => value >= 3);
			return result.length === 7 && totalScore1 >= totalScore2;
		} else if (playerId === 2) {
			const result = player2.filter(value => value >= 3);
			return result.length === 7 && totalScore2 >= totalScore1;
		}
		return false;
	}

	return (
		<div className="gameboard">
			<header className="header">
				<h1>Cricket Game</h1>
			</header>
			<div className="game">
				<div className="player-info">
					<div className="player-name">
						{players[0]}
					</div>
					<div className="player-switch-button">
						<Button icon="pi pi-arrow-right-arrow-left"/>
					</div>
					<div className="player-name">
						{players[2]}
					</div>
				</div>
				{cricketGameScores.map((score, index) => {
					return (
						<div className={`player-info ${isDisabled(index) ? "disabled" : ""}`} key={index}>
							<HitScore
								onIncrementScore={incrementScore}
								index={index}
								disabled={isDisabled(index)}
								playerId={1}/>
							<div className="player-switch-button">
								{score}
							</div>
							<HitScore
								onIncrementScore={incrementScore}
								index={index}
								disabled={isDisabled(index)}
								playerId={2}/>
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
						Round
					</div>
					<TotalScore
						score={totalScore2}
						isWinner={isWinner(2)}/>
				</div>
			</footer>
		</div>
	)
}