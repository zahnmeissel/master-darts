import BaseScore from "../components/BaseScore.tsx";
import {useCallback, useState} from "react";
import {useGame} from "../../context/GameContext";
import styles from "./HitScore.module.scss";
import type {CricketTarget} from "../../domain/rules/CricketUnifiedRules.ts";

interface HitScoreProps extends React.HTMLAttributes<HTMLDivElement> {
    target: number;
    disabled: boolean;
    playerIndex: number;
}

export default function HitScore({target, playerIndex, disabled, ...restProps}: HitScoreProps) {

    const {gameState, gameDispatch} = useGame();

    const [count, setCount] = useState(0);

    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        console.log("HitScore clicked", event);
        if (!disabled) {
            setCount(c => c + 1);
            gameDispatch({type: "SET_CURRENT_PLAYER_INDEX", playerIndex});
            gameDispatch({type: "THROW_DART", dart: {value: target as CricketTarget, multiplier: 1}})
        }
    }, [disabled, target, playerIndex]);

    const isTargetClosed = gameState.players.every(p => p.marks[target] >= 3);

    return (

        <BaseScore onClick={handleClick} {...restProps}
                   playerIndex={playerIndex}
                   className={[
                       styles.hitScore,
                       (disabled || isTargetClosed) ? styles["hitScore--disabled"] : "",
                   ].filter(Boolean).join(" ")}>
            {count === 1 && <i className={`pi pi-minus ${styles.cricketIcon}`}/>}
            {count === 2 && <i className={`pi pi-plus ${styles.cricketIcon}`}/>}
            {count >= 3 && <i className={`pi pi-plus-circle ${styles.cricketIcon}`}/>}
        </BaseScore>
    )
}