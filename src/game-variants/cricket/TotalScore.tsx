type TotalScoreProps = {
	score: number;
	isWinner: boolean;
}
export default function TotalScore({score, isWinner}: TotalScoreProps) {
	const value = isWinner ? "Winner " : "";

	return (
		<div className={`total-score ${isWinner ? "total-score--winner" : ""}`}>
			{value}{score}
		</div>
	);
}