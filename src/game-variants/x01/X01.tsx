import {useGame} from "../../context/GameContext.tsx";
import {useGameSetup} from "../../context/gameSetupContext.tsx";
import type {UnifiedGameState} from "../../domain/model/UnifiedGameState.ts";
import {type X01Player, X01UnifiedRules, type X01VariantState} from "../../domain/rules/X01UnifiedRules.ts";
import {useEffect, useRef, useState} from "react";
import styles from "./X01.module.scss";
import {Button} from "primereact/button";
import type {DartValue} from "../../domain/dartTypes.ts";
import {GameType} from "../../lib/constants.ts";

function firstTo(bestOf: number) {
    return Math.floor(bestOf / 2) + 1;
}

export default function X01() {
    const {gameState, gameDispatch} = useGame();
    const {state, dispatch: setupDispatch} = useGameSetup();

    const [turnInputs, setTurnInputs] = useState<Record<number, number | "">>({});
    const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    if (state.gameType !== GameType.X01) {
        return null;
    }

    const x01GameState = gameState as UnifiedGameState<X01Player, X01VariantState>;
    const players = x01GameState.players;
    const currentPlayerIndex = x01GameState.currentPlayerIndex;

    useEffect(() => {
        inputRefs.current[currentPlayerIndex]?.focus();
    }, [currentPlayerIndex]);

    const options = x01GameState.x01Options ?? {
        startScore: 501,
        outRule: "DOUBLE_OUT",
        legsPerSet: 3,
        sets: 1,
    }

    const legsToWin = firstTo(options.legsPerSet);
    const setsToWin = firstTo(options.sets);

    const submitTurn = (playerIndex: number) => {
        if (x01GameState.status === "GAME_FINISHED") return;
        if (playerIndex !== currentPlayerIndex) return;

        const point = typeof turnInputs[playerIndex] === "number" ? turnInputs[playerIndex] : 0;
        gameDispatch({type: "THROW_DART", dart: {value: point as DartValue, multiplier: 1}});

        setTurnInputs((prev) => ({
            ...prev,
            [playerIndex]: "",
        }));
    };

    const isFinished = x01GameState.status === "GAME_FINISHED";
    const rules = x01GameState.rules as X01UnifiedRules;

    const onInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        playerIndex: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitTurn(playerIndex);
        }
    };

    return (
        <div className={styles.gameboard}>
            <header className={styles.boardHeader}>
                <button
                    className={"board-reset"}
                    type="button"
                    aria-label="Close"
                    onClick={() => gameDispatch({type: "RESET_GAME"})}
                >
                    <i className="pi pi-replay"/>
                </button>
                <div>
                    <div className={styles.boardTitle}>
                        <div><b>{rules.startScore}</b></div>
                        <div className={styles.turnSub}>
                            <b>{String(options.outRule).replace("_", " ")}</b>
                        </div>
                    </div>
                </div>

                <button className="board-close" type="button" aria-label="Close"
                        onClick={() => setupDispatch({type: "RESET_SETUP"})}>
                    <i className="pi pi-times"/>
                </button>
            </header>

            {/*Player bar*/}
            <section className={styles.playerBar}>
                <div className={styles.playerRow}>
                    {players.map((p, idx) => {
                        const active = idx === currentPlayerIndex;
                        return (
                            <div
                                key={p.id ?? idx}
                                className={`${styles.playerCard} ${active ? styles.playerCardActive : ""}`}
                            >
                                <div className={styles.playerName}>{p.name}</div>
                                <div className={styles.playerMeta}>
                                    <span>Sets {p.setsWon ?? 0}/{setsToWin}</span>
                                    <span>Legs {p.legsWon ?? 0}/{legsToWin}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/*Content*/}
            <main className={styles.boardContent}>
                <div className={styles.scores}>
                    {players.map((p, idx) => {
                        const active = idx === currentPlayerIndex;
                        return (
                            <div key={p.id ?? idx}>
                                <div className={styles.turnInputs}>
                                    <input
                                        ref={(el) => {
                                            inputRefs.current[idx] = el;
                                        }}
                                        className={styles.turnInput}
                                        value={turnInputs[idx] ?? ""}
                                        onChange={(e) =>
                                            setTurnInputs((prev) => ({
                                                ...prev,
                                                [idx]: e.target.value === "" ? "" : Number(e.target.value),
                                            }))
                                        }
                                        onKeyDown={(e) => onInputKeyDown(e, idx)}
                                        placeholder="D1"
                                        disabled={idx !== currentPlayerIndex || isFinished}
                                    />
                                </div>

                                <div className={styles.scoreCol}>
                                    <div className={styles.scoreLabel}>
                                        {active ? "-> " : ""}{p.name}
                                    </div>
                                    <div className={styles.scoreValue}>
                                        {p.score ?? 0}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.turnPanel}>

                    <div className={styles.turnActions}>
                        <Button label="Undo" outlined onClick={() => gameDispatch({type: "UNDO"})} disabled/>
                    </div>

                </div>
            </main>
            {/* Footer */}
            <footer className={styles.footer}>
            </footer>
        </div>
    )
}