import {Button} from "primereact/button";
import {type GameProps, type PlayerInfo, cricketGameScores, cricketGameScoresAsNumbers} from "../../lib/constants.ts";
import {useState} from "react";
import TotalScore from "./TotalScore.tsx";
import HitScore from "../components/HitScore.tsx";
import {useGame} from "../../context/GameContext";
import {TARGETS} from "../../domain/rules/CricketUnifiedRules";
import {useGameSetup} from "../../context/gameSetupContext";

export default function Cricket({playerNames}: GameProps) {

    const {gameState, gameDispatch} = useGame();
    const {state, dispatch} = useGameSetup();

    const isTwoPlayers = gameState.players.length === 2;

    return (
        <>
            <div className="gameboard">
                <header className="board-header">
                    <h1 className={"board-title"}>Cricket Game</h1>
                    <button className="board-close" type="button" aria-label="Close" onClick={() => dispatch({type: "RESET_SETUP"})}>
                        <i className="pi pi-times" />
                    </button>
                </header>
                <div className="game">
                    <div className="player-info">
                        {gameState.players.reduce<React.ReactNode[]>((acc, player, i) => {
                            if (!isTwoPlayers && i === 0) {
                                acc.push(
                                    <div className="player-switch-button" key="switch-left">
                                        <Button icon="pi pi-arrow-right-arrow-left"/>
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
                    {TARGETS.map((score, index) => {
                        return (
                            <div className={`player-info`} key={index}>
                                {
                                    isTwoPlayers ? (
                                        <>
                                            <HitScore
                                                index={index}
                                                disabled={false}
                                                playerId={gameState.players[0].id}/>
                                            <div className="player-switch-button">
                                                {score}
                                            </div>
                                            <HitScore
                                                index={index}
                                                disabled={false}
                                                playerId={gameState.players[1].id}/>
                                        </>
                                    ) : (
                                        <>
                                            <div className="player-switch-button">
                                                {score}
                                            </div>
                                            {gameState.players.map((player, keyIndex) => (
                                                <HitScore
                                                    key={player.id}
                                                    index={index}
                                                    disabled={false}
                                                    playerId={player.id}/>
                                            ))}
                                        </>
                                    )
                                }
                            </div>
                        )
                    })
                    }
                </div>
                <footer className={"footer"}>
                    <div className="player-info">
                        {isTwoPlayers ? (
                            <>
                                <TotalScore
                                    score={"totalScore1"}
                                    isWinner={false}/>
                                <div className="player-switch-button">
                                    Round
                                </div>
                                <TotalScore
                                    score={"totalScore2"}
                                    isWinner={false}/>
                            </>
                        ) : (
                            <>
                                <div className="player-switch-button">
                                    Round
                                </div>
                                {players.map((player, keyIndex) => (
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