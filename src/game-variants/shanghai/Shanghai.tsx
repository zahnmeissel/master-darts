import { Button } from "primereact/button";
import { useCallback, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { useGameSetup } from "../../context/gameSetupContext";
import BaseScore from "../components/BaseScore";
import styles from "./Shanghai.module.scss";

// Wenn du die Helper schon in den Rules hast, gern importieren.
// Sonst hier:
function getRoundTarget(round: number, includeBull: boolean) {
	if (includeBull && round === 21) return 25;
	return round;
}

export default function Shanghai() {
	const { gameState, gameDispatch } = useGame();
	const { dispatch: setupDispatch } = useGameSetup();

	const includeBull = !!(gameState as any).shanghaiOptions?.includeBull;
	const shanghaiTurn = (gameState as any).shanghaiTurn;
	const round = shanghaiTurn?.round ?? 1;
	const dartInTurn = shanghaiTurn?.dartInTurn ?? 0;

	const target = useMemo(() => getRoundTarget(round, includeBull), [round, includeBull]);

	const currentPlayerIndex = gameState.currentPlayerIndex;
	const players = gameState.players;

	const throwDart = useCallback(
		(multiplier: 1 | 2 | 3) => {
			if (gameState.status === "GAME_FINISHED") return;

			// (optional) sicherstellen, dass currentPlayerIndex stimmt
			// gameDispatch({ type: "SET_CURRENT_PLAYER_INDEX", playerIndex: currentPlayerIndex });

			gameDispatch({
				type: "THROW_DART",
				dart: { value: target, multiplier },
			});
		},
		[gameDispatch, gameState.status, target]
	);

	const miss = useCallback(() => {
		if (gameState.status === "GAME_FINISHED") return;
		// "miss" => value != target, dann zählt es nicht
		gameDispatch({ type: "THROW_DART", dart: { value: 0, multiplier: 1 } });
	}, [gameDispatch, gameState.status]);

	const isFinished = gameState.status === "GAME_FINISHED";

	return (
		<div className={styles.gameboard}>
			<header className={styles.boardHeader}>
				<h1 className={styles.boardTitle}>Shanghai</h1>

				<button
					className={styles.boardClose}
					type="button"
					aria-label="Close"
					onClick={() => setupDispatch({ type: "RESET_SETUP" })}
				>
					<i className="pi pi-times" />
				</button>
			</header>

			{/* Player-Bar: feste Höhe */}
			<section className={styles.playerBar}>
				<div className={styles.playerRow}>
					{players.map((p: any, idx: number) => {
						const active = idx === currentPlayerIndex;
						return (
							<div
								key={p.id ?? idx}
								className={`${styles.playerCard} ${active ? styles.playerCardActive : ""}`}
							>
								<div className={styles.playerName}>{p.name}</div>
								<div className={styles.playerScore}>{p.score ?? 0}</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* Content: nimmt Resthöhe */}
			<main className={styles.boardContent}>
				<div className={styles.centerPanel}>
					<div className={styles.roundInfo}>
						<div className={styles.roundLabel}>Round</div>
						<div className={styles.roundValue}>{round}</div>
					</div>

					<div className={styles.targetBox}>
						<div className={styles.targetLabel}>Target</div>
						<div className={styles.targetValue}>{target === 25 ? "BULL" : target}</div>
					</div>

					<div className={styles.actions}>
						<BaseScore
							className={styles.actionBtn}
							onClick={() => throwDart(1)}
							disabled={isFinished}
							playerIndex={currentPlayerIndex}
						>
							S
						</BaseScore>

						<BaseScore
							className={styles.actionBtn}
							onClick={() => throwDart(2)}
							disabled={isFinished}
							playerIndex={currentPlayerIndex}
						>
							D
						</BaseScore>

						<BaseScore
							className={styles.actionBtn}
							onClick={() => throwDart(3)}
							disabled={isFinished}
							playerIndex={currentPlayerIndex}
						>
							T
						</BaseScore>

						<BaseScore
							className={styles.actionBtn}
							onClick={miss}
							disabled={isFinished}
							playerIndex={currentPlayerIndex}
						>
							MISS
						</BaseScore>
					</div>
				</div>
			</main>

			{/* Footer: feste Höhe */}
			<footer className={styles.footer}>
				<div className={styles.footerLeft}>
					Dart: {Math.min(dartInTurn + 1, 3)}/3
				</div>

				<div className={styles.footerCenter}>
					Player: {players[currentPlayerIndex]?.name ?? "-"}
				</div>

				<div className={styles.footerRight}>
					<Button
						label="New Game"
						onClick={() => setupDispatch({ type: "RESET_SETUP" })}
						disabled={false}
					/>
				</div>
			</footer>
		</div>
	);
}