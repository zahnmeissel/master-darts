import BaseScore from "../components/BaseScore.tsx";
import {useCallback} from "react";
import {useGame} from "../../context/GameContext";
import styles from "./HitScore.module.scss";
import type {CricketPlayer, CricketTarget, CricketVariantState} from "../../domain/rules/CricketUnifiedRules.ts";
import * as React from "react";
import type {UnifiedGameState} from "../../domain/model/UnifiedGameState.ts";

interface HitScoreProps extends React.HTMLAttributes<HTMLDivElement> {
    target: CricketTarget;
    disabled: boolean;
    playerIndex: number;
}

export default function HitScore({target, playerIndex, disabled, ...restProps}: HitScoreProps) {

    const {gameState, gameDispatch} = useGame();

    const cricketGameState = gameState as UnifiedGameState<CricketPlayer, CricketVariantState>;

    const handleClick = useCallback(() => {
        if (!disabled) {
            gameDispatch({type: "SET_CURRENT_PLAYER_INDEX", playerIndex});
            gameDispatch({type: "THROW_DART", dart: {value: target, multiplier: 1}})
        }
    }, [disabled, target, playerIndex]);

    const isTargetClosed = cricketGameState.players.every(p => p.marks[target] >= 3);
    const count = cricketGameState.players[playerIndex].marks[target];
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