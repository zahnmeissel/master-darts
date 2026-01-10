import BaseScore from "./BaseScore.tsx";
import {useCallback, useState} from "react";

interface HitScoreProps extends React.HTMLAttributes<HTMLDivElement> {
	index: number;
	disabled: boolean;
	playerId: number;
	onIncrementScore: (score: number, index: number, playerId: number) => void;
}

export default function HitScore({onIncrementScore, index, playerId, disabled, ...restProps}: HitScoreProps) {
	const [count, setCount] = useState(0);

	const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		console.log("HitScore clicked", event);
		if (!disabled) {
			setCount(prevCount => {
				const newCount = prevCount + 1;
				onIncrementScore(newCount, index, playerId);
				return newCount;
			});
		}
	}, [disabled, onIncrementScore, index, playerId]);

	return (
		<BaseScore onClick={handleClick} {...restProps}
				   className={`hit-score ${disabled ? "hit-score--disabled" : ""}`}>
			{count === 1 && <i className="pi pi-minus cricket-icon"/>}
			{count === 2 && <i className="pi pi-plus cricket-icon"/>}
			{count >= 3 && <i className="pi pi-plus-circle cricket-icon"/>}
		</BaseScore>
	);
}