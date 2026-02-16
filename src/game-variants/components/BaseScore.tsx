import {useCallback, useEffect, useRef, useState} from "react";
import styles from "./BaseScore.module.scss";
import {useGame} from "../../context/GameContext";

interface BaseScoreProps extends React.HTMLAttributes<HTMLDivElement> {
    playerIndex?: number;
}

export default function BaseScore(
    {
        children,
        className,
        style,
        onClick,
        playerIndex,
        ...restProps
    }: BaseScoreProps) {

    const divRef = useRef(null);

    const {gameState, gameDispatch} = useGame();
    const [isFocused, setIsFocused] = useState(false);
    const [winnerAlt, setWinnerAlt] = useState(false);

    /*
    * das klappt nicht da isWinner erst auf true geht wenn das Click durchgeführt wurde
    * das muss nachher von aussen gesteuert werden...
    * */
    const isWinner = playerIndex != null ? gameState.players[playerIndex]?.isWinner : false;

    useEffect(() => {
        if (!isWinner) {
            setWinnerAlt(false); // zurück auf default wenn kein winner
            return;
        }

        setWinnerAlt(true);
        const id = window.setInterval(() => {
            setWinnerAlt((v) => !v);
        }, 2000);

        return () => window.clearInterval(id);
    }, [isWinner]);

    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        divRef.current?.focus(); // Setzt den nativen Fokus auf das Div
        onClick?.(event); // Ruft den externen onClick-Handler auf, falls vorhanden
    }, [onClick]);

    const options = [
        styles.baseScore,
        isFocused ? styles["baseScore--focused"] : "",
        isWinner ? styles["baseScore--winner"] : "",                 // sofort
        className ?? ""
    ];
    return (
        <div
            className={options.filter(Boolean).join(" ")}
            tabIndex={0}
            style={style}
            ref={divRef}
            onClick={handleClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...restProps}
        >
            {children}
        </div>
    );
}