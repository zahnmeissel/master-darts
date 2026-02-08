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

    const [player1, setPlayer1] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [player2, setPlayer2] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [totalScore1, setTotalScore1] = useState(0);
    const [totalScore2, setTotalScore2] = useState(0);

    const [players, setPlayers] = useState<PlayerInfo[]>(() => {
        return convertInitialPlayers(playerNames);
    });

    const isTwoPlayers = gameState.players.length === 2;

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
        return false;//players.every(p => isClosed(p, number));
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
        return false;//player1[index] >= 3 && player2[index] >= 3;
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
                            <div className={`player-info ${isDisabled(index) ? "disabled" : ""}`} key={index}>
                                {
                                    isTwoPlayers ? (
                                        <>
                                            <HitScore
                                                index={index}
                                                disabled={isNumberClosed(index)}
                                                playerId={gameState.players[0].id}/>
                                            <div className="player-switch-button">
                                                {score}
                                            </div>
                                            <HitScore
                                                index={index}
                                                disabled={isNumberClosed(index)}
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
                                                    disabled={isClosed(player, index)}
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
                {/*<footer className={"footer"}>
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
                </footer>*/}
            </div>
        </>
    )
}