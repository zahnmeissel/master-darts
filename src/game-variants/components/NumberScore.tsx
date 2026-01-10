import BaseScore from "./BaseScore.tsx";
import {useCallback, useState} from "react";

interface NumberScoreProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function NumberScore({children, onKeyDown, ...restProps}: NumberScoreProps) {
	const [value, setValue] = useState("");

	const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		console.log("Key pressed:", event.key);
		if (event.key >= "0" && event.key <= "9") {
			setValue(prev => prev + event.key);
		}
	}, [onKeyDown]);

	return (
		<BaseScore className={"number-score"} onKeyDown={handleKeyDown} {...restProps}>
			{value}
		</BaseScore>
	);
}