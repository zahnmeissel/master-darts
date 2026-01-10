import {useState} from "react";
import {InputText} from "primereact/inputtext";
import NumberScore from "../components/NumberScore.tsx";

type ShanghaiScoreProps = {
	index: number;
	disabled: boolean;
	playerId: number;
	onIncrementScore: (score: number, index: number, playerId: number) => void;
}
export default function ShanghaiScore({onIncrementScore, index, playerId, disabled}: ShanghaiScoreProps) {
	const [count, setCount] = useState(0);

	const handleClick = () => {
		if (!disabled) {
			const newCount = count + 1;
			setCount(newCount);
			onIncrementScore(newCount, index, playerId);
		}
	}

	return (
		<div className={"score-field"}>
			{playerId === 2 && <div className={"marker"}>
              <i className={"pi pi-caret-right"}/>
            </div>}
			<NumberScore></NumberScore>
			{playerId === 1 && <div className={"marker"}>
              <i className={"pi pi-caret-left"}/>
            </div>}
		</div>
	)
}