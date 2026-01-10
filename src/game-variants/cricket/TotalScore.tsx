type TotalScoreProps = {
	score: number;
	isWinner: boolean;
}
export default function TotalScore({score, isWinner}: TotalScoreProps) {
	return (
		<div className={`total-score ${isWinner ? "total-score--winner" : ""}`}>
			{score}
		</div>
	);
}