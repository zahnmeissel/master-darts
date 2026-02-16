import NumberScore from "../components/NumberScore.tsx";

export default function ShanghaiScore() {

	return (
		<div className={"score-field"}>
			{<div className={"marker"}>
              <i className={"pi pi-caret-right"}/>
            </div>}
			<NumberScore></NumberScore>
			{<div className={"marker"}>
              <i className={"pi pi-caret-left"}/>
            </div>}
		</div>
	)
}