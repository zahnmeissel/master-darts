import {useCallback, useRef, useState} from "react";
import styles from "./BaseScore.module.scss";
import {useGame} from "../../context/GameContext";
import * as React from "react";

interface BaseScoreProps extends React.HTMLAttributes<HTMLDivElement> {
    playerIndex?: number;
    disabled?: boolean;
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

    const divRef = useRef<HTMLDivElement | null>(null);

    const {gameState} = useGame();
    const [isFocused, setIsFocused] = useState(false);

    const isWinner = playerIndex != null ? gameState.players[playerIndex]?.isWinner : false;

    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (gameState.status === "GAME_FINISHED") return;
        divRef.current?.focus();
        onClick?.(event);
    }, [onClick, gameState.status]);

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