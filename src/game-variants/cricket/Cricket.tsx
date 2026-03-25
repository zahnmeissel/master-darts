import TotalScore from "./TotalScore.tsx";
import HitScore from "../cricket/HitScore.tsx";
import {useGame} from "../../context/GameContext";
import {type CricketPlayer, type CricketVariantState, TARGETS} from "../../domain/rules/CricketUnifiedRules";
import {useGameSetup} from "../../context/gameSetupContext";
import "../../styles/base.scss";
import styles from "./Cricket.module.scss";
import * as React from "react";
import {GameType} from "../../lib/constants.ts";
import type {UnifiedGameState} from "../../domain/model/UnifiedGameState.ts";

export default function Cricket() {

    const {gameState, gameDispatch} = useGame();
    const {state, dispatch} = useGameSetup();

    if (state.gameType !== GameType.CRICKET) {
        return null;
    }

    const cricketGameState = gameState as UnifiedGameState<CricketPlayer, CricketVariantState>;
    const isTwoPlayers = cricketGameState.players.length === 2;

    return (
        <>
            <div className="gameboard">
                <header className="board-header">
                    <button
                        className={"board-reset"}
                        type="button"
                        aria-label="Close"
                        onClick={() => gameDispatch({ type: "RESET_GAME" })}
                    >
                        <i className="pi pi-replay" />
                    </button>
                    <h1 className={"board-title"}>{cricketGameState.rules.name}</h1>
                    <button className="board-close" type="button" aria-label="Close"
                            onClick={() => dispatch({type: "RESET_SETUP"})}>
                        <i className="pi pi-times"/>
                    </button>
                </header>
                <main className={styles["gameboard-content"]}>
                    <div className={`players ${isTwoPlayers ? "players--two" : "players--multi"}`}
                         style={!isTwoPlayers ? ({["--player-count" as any]: cricketGameState.players.length} as React.CSSProperties) : undefined}>
                        {cricketGameState.players.reduce<React.ReactNode[]>((acc, player, i) => {
                            if (!isTwoPlayers && i === 0) {
                                acc.push(
                                    <div className="player-switch-button" key="switch-left">
                                    </div>
                                );
                            }

                            acc.push(
                                <div className="player-name" key={`p-${player.id ?? i}`}>
                                    {String(player.name)}
                                </div>
                            );

                            if (isTwoPlayers && i === 0) {
                                acc.push(
                                    <div className="player-switch-button" key="switch-mid">

                                    </div>
                                );
                            }

                            return acc;
                        }, [])}
                    </div>
                    <div className={styles["game"]}>
                        {
                            TARGETS.map((score, index) => {
                                const isTargetClosed = cricketGameState.players.every(p => p.marks[score] >= 3);
                                return (
                                    <div className={`score-row ${isTwoPlayers ? "score-row--two" : "score-row--multi"}`}
                                         key={index}
                                         style={!isTwoPlayers ? ({["--player-count" as any]: cricketGameState.players.length} as React.CSSProperties) : undefined}>
                                        {cricketGameState.players.reduce<React.ReactNode[]>((acc, player, i) => {
                                            if (!isTwoPlayers && i === 0) {
                                                acc.push(
                                                    <div className="player-switch-button" key="switch-left">
                                                        {score}
                                                    </div>
                                                );
                                            }

                                            acc.push(
                                                <HitScore
                                                    key={`p-${player.id ?? i}`}
                                                    target={score}
                                                    disabled={isTargetClosed}
                                                    playerIndex={i}/>
                                            );

                                            if (isTwoPlayers && i === 0) {
                                                acc.push(
                                                    <div className="player-switch-button" key="switch-mid">
                                                        {score}
                                                    </div>
                                                );
                                            }

                                            return acc;
                                        }, [])}
                                    </div>
                                )
                            })
                        }
                    </div>
                </main>
                <footer className={"footer"}>
                    <div className={`score-row ${isTwoPlayers ? "score-row--two" : "score-row--multi"}`}
                         style={!isTwoPlayers ? ({["--player-count" as any]: cricketGameState.players.length} as React.CSSProperties) : undefined}>
                        {cricketGameState.players.reduce<React.ReactNode[]>((acc, player, i) => {
                            if (!isTwoPlayers && i === 0) {
                                acc.push(
                                    <div className="player-switch-button" key="switch-left">
                                    </div>
                                );
                            }

                            acc.push(
                                <TotalScore
                                    key={`p-${player.id ?? i}`}
                                    score={player.score}
                                    isWinner={player.isWinner}/>
                            );

                            if (isTwoPlayers && i === 0) {
                                acc.push(
                                    <div className="player-switch-button" key="switch-mid">

                                    </div>
                                );
                            }

                            return acc;
                        }, [])}
                    </div>
                </footer>
            </div>
        </>
    )
}