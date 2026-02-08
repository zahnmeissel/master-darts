import BaseScore from "./BaseScore.tsx";
import {useCallback, useState} from "react";
import type {DartThrow} from "../../domain/dartTypes";
import {useGame} from "../../context/GameContext";

interface HitScoreProps extends React.HTMLAttributes<HTMLDivElement> {
	index: number;
	disabled: boolean;
	playerId: number;
}

export default function HitScore({target, playerId, disabled, ...restProps}: HitScoreProps) {

	const {gameState, gameDispatch} = useGame();

	const [count, setCount] = useState(0);

	const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		console.log("HitScore clicked", event);
		if (!disabled) {
			setCount(c => c + 1);
			gameDispatch({type: "SET_CURRENT_PLAYER_INDEX", playerId});
			gameDispatch({type: "THROW_DART", dart: {value: target, multiplier: 1}})
		}
	}, [disabled, target, playerId]);

	return (
		<BaseScore onClick={handleClick} {...restProps}
				   className={`hit-score ${disabled ? "hit-score--disabled" : ""}`}>
			{count === 1 && <i className="pi pi-minus cricket-icon"/>}
			{count === 2 && <i className="pi pi-plus cricket-icon"/>}
			{count >= 3 && <i className="pi pi-plus-circle cricket-icon"/>}
		</BaseScore>
	);
}