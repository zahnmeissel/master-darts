import {Button} from "primereact/button";
import {allScores} from "../../lib/constants.ts";
import TotalScore from "../cricket/TotalScore.tsx";
import ShanghaiScore from "./ShanghaiScore.tsx";

export default function Shanghai() {
	return (
		<div className="gameboard">
			<header className="header">
				<div className={"info"}>
					<div>
						<h1>Shanghai Game</h1>
					</div>
					<div className="player-info">
						<div className="player-name">
							Spieler 1
						</div>
						<div className="player-switch-button">
							<Button icon="pi pi-arrow-right-arrow-left"/>
						</div>
						<div className="player-name">
							Spieler 2
						</div>
					</div>
				</div>
			</header>
			<div className="game">
				{allScores.map((score, index) => {
					return (
						<div className={`score-row`} key={index}>
							<ShanghaiScore />
							<div className="player-switch-button">
								{score}
							</div>
							<ShanghaiScore />
						</div>
					)
				})}
			</div>
			<footer className={"footer"}>
				<div className="player-info">
					<TotalScore
						score={0}
						isWinner={false}/>
					<div className="player-switch-button">

					</div>
					<TotalScore
						score={0}
						isWinner={false}/>
				</div>
			</footer>
		</div>
	);
}