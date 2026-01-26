import {Button} from "primereact/button";
import {type GameProps, type PlayerInfo, cricketGameScores, cricketGameScoresAsNumbers} from "../../lib/constants.ts";
import {useState} from "react";
import TotalScore from "./TotalScore.tsx";
import HitScore from "../components/HitScore.tsx";

export default function Cricket({playerNames}: GameProps) {

    const [player1, setPlayer1] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [player2, setPlayer2] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [totalScore1, setTotalScore1] = useState(0);
    const [totalScore2, setTotalScore2] = useState(0);

    const [players, setPlayers] = useState<PlayerInfo[]>(() => {
        return convertInitialPlayers(playerNames);
    });

    const isTwoPlayers = playerNames.length === 2;

    function convertInitialPlayers(playerNames): PlayerInfo[] {
        if (!Array.isArray(playerNames)) return [];
        const list = playerNames.map((item, index) => ({
            id: index,
            name: item,
            score: 0,
            hits: {}
        }));
        return list;
    }

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
        setPlayers(prev => applyHit(prev, playerId, index));
    }

    function isClosed(player: PlayerInfo, number: number): boolean {
        return (player.hits[number] ?? 0) >= 3;
    }

    function isNumberClosed(number: number): boolean {
        return players.every(p => isClosed(p, number));
    }

    function allOpponentsClosed(players: PlayerInfo[], activePlayerId: number, number: number) {
        return players
            .filter(p => p.id !== activePlayerId)
            .every(p => isClosed(p, number));
    }

    function hasClosedAll(player: PlayerInfo): boolean {
        return cricketGameScores.every(
            number => (player.hits[number] ?? 0) >= 3
        );
    }

    function getWinner(players: PlayerInfo[]): PlayerInfo | null {
        for (const player of players) {
            if (!hasClosedAll(player)) continue;

            const hasEnoughPoints = players.every(
                p => p.id === player.id || player.score >= p.score
            );

            if (hasEnoughPoints) {
                return player;
            }
        }

        return null;
    }

    function applyHit(players: PlayerInfo[], activePlayerId: number, number: number) {
        return players.map(player => {
            if (player.id != activePlayerId) return player;

            const currentHits = player.hits[number] ?? 0;
            const newHits = Math.min(currentHits + 1, 3);
            const overflow = Math.max(currentHits + 1, 0);

            let addedScore = 0;
            if (currentHits >= 3 || (newHits === 3 && !allOpponentsClosed(players, activePlayerId, number))) {
                addedScore = overflow * number;
            }

            console.log("player score = ", player.score);
            console.log("addedscore = ", addedScore);
            return {
                ...player,
                hits: {
                    ...player.hits,
                    [number]: newHits
                },
                score: player.score + addedScore
            };
        });
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
        for (const player of players) {
            if (!hasClosedAll(player)) continue;

            const hasEnoughPoints = players.every(
                p => p.id === player.id || player.score >= p.score
            );

            if (hasEnoughPoints) {
                return true;
            }
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
                    {isTwoPlayers ? (
                        <>
                            <div className="player-name">
                                {playerNames[0]}
                            </div>
                            <div className="player-name">
                                {playerNames[1]}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="player-switch-button">
                                <Button icon="pi pi-arrow-right-arrow-left"/>
                            </div>
                            {players.map((player, index) => (
                                <div className="player-name" key={index}>
                                    {player}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                {cricketGameScores.map((score, index) => {
                    return (
                        <div className={`player-info ${isDisabled(index) ? "disabled" : ""}`} key={index}>
                            {
                                isTwoPlayers ? (
                                    <>
                                        <HitScore
                                            onIncrementScore={incrementScore}
                                            index={index}
                                            disabled={isNumberClosed(index)}
                                            playerId={0}/>
                                        <div className="player-switch-button">
                                            {score}
                                        </div>
                                        <HitScore
                                            onIncrementScore={incrementScore}
                                            index={index}
                                            disabled={isNumberClosed(index)}
                                            playerId={1}/>
                                    </>
                                ) : (
                                    <>
                                        <div className="player-switch-button">
                                            {score}
                                        </div>
                                        {players.map((player, keyIndex) => (
                                            <HitScore
                                                key={keyIndex}
                                                onIncrementScore={incrementScore}
                                                index={index}
                                                disabled={isClosed(player, index)}
                                                playerId={keyIndex}/>
                                        ))}
                                    </>
                                )
                            }
                        </div>
                    )
                })}
            </div>
            <footer className={"footer"}>
                <div className="player-info">
                    {isTwoPlayers ? (
                        <>
                            <TotalScore
                                score={totalScore1}
                                isWinner={isWinner(0)}/>
                            <div className="player-switch-button">
                                Round
                            </div>
                            <TotalScore
                                score={totalScore2}
                                isWinner={isWinner(1)}/>
                        </>
                    ) : (
                        <>
                            <div className="player-switch-button">
                                Round
                            </div>
                            {players.map((player, keyIndex) => (
                                <TotalScore
                                    score={player.score}
                                    isWinner={isWinner(keyIndex)}/>
                            ))}
                        </>
                    )}
                </div>
            </footer>
        </div>
    )
}