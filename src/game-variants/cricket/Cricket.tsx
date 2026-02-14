import {Button} from "primereact/button";
import {type GameProps, type PlayerInfo, cricketGameScores, cricketGameScoresAsNumbers} from "../../lib/constants.ts";
import {useState} from "react";
import TotalScore from "./TotalScore.tsx";
import HitScore from "../components/HitScore.tsx";
import {useGame} from "../../context/GameContext";
import {TARGETS} from "../../domain/rules/CricketUnifiedRules";
import {useGameSetup} from "../../context/gameSetupContext";
import cricketStyles from "./Cricket.module.scss"

export default function Cricket({playerNames}: GameProps) {

    const {gameState, gameDispatch} = useGame();
    const {state, dispatch} = useGameSetup();

    const isTwoPlayers = gameState.players.length === 2;

    return (
        <>
            <div className="gameboard">
                <header className="board-header">
                    <h1 className={"board-title"}>{gameState.rules.name}</h1>
                    <button className="board-close" type="button" aria-label="Close"
                            onClick={() => dispatch({type: "RESET_SETUP"})}>
                        <i className="pi pi-times"/>
                    </button>
                </header>
                <main className="gameboard-content">
                    <div className={`players ${isTwoPlayers ? "players--two" : "players--multi"}`}
                         style={!isTwoPlayers ? ({["--player-count" as any]: gameState.players.length} as React.CSSProperties) : undefined}>
                        {gameState.players.reduce<React.ReactNode[]>((acc, player, i) => {
                            if (!isTwoPlayers && i === 0) {
                                acc.push(
                                    <div className="player-switch-button" key="switch-left">
                                        <Button icon="pi pi-arrow-right-arrow-left" hidden={true}/>
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
                                        <Button icon="pi pi-arrow-right-arrow-left"/>
                                    </div>
                                );
                            }

                            return acc;
                        }, [])}
                    </div>
                    <div className={"game"}>
                        {
                            TARGETS.map((score, index) => {
                                const isTargetClosed = gameState.players.every(p => p.marks[score] >= 3);
                                return (
                                    <div className={`score-row ${isTwoPlayers ? "score-row--two" : "score-row--multi"}`}
                                         key={index}
                                         style={!isTwoPlayers ? ({["--player-count" as any]: gameState.players.length} as React.CSSProperties) : undefined}>
                                        {
                                            isTwoPlayers ? (
                                                <>
                                                    <HitScore
                                                        target={score}
                                                        disabled={isTargetClosed}
                                                        playerIndex={0}/>
                                                    <div className="player-switch-button">
                                                        {score}
                                                    </div>
                                                    <HitScore
                                                        target={score}
                                                        disabled={isTargetClosed}
                                                        playerIndex={1}/>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="player-switch-button">
                                                        {score}
                                                    </div>
                                                    {gameState.players.map((player, keyIndex) => (
                                                        <HitScore
                                                            key={player.id}
                                                            target={index}
                                                            disabled={false}
                                                            playerIndex={keyIndex}/>
                                                    ))}
                                                </>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </main>
                <footer className={"footer"}>
                    <div className={`score-row ${isTwoPlayers ? "score-row--two" : "score-row--multi"}`}
                         style={!isTwoPlayers ? ({["--player-count" as any]: gameState.players.length} as React.CSSProperties) : undefined}>
                        {isTwoPlayers ? (
                            <>
                                <TotalScore
                                    score={gameState.players[0].score}
                                    isWinner={false}/>
                                <div className="player-switch-button">

                                </div>
                                <TotalScore
                                    score={gameState.players[1].score}
                                    isWinner={false}/>
                            </>
                        ) : (
                            <>
                                <div className="player-switch-button">

                                </div>
                                {gameState.players.map((player, keyIndex) => (
                                    <TotalScore
                                        score={"player.score"}
                                        isWinner={false}/>
                                ))}
                            </>
                        )}
                    </div>
                </footer>
            </div>
        </>
    )
}