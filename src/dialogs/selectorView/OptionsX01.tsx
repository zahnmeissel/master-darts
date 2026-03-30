import {useGameSetup} from "../../context/gameSetupContext.tsx";
import {GameType} from "../../lib/constants.ts";
import PlayerOptions from "./playerOptions.tsx";
import type {X01OutRule, X01StartScore} from "../../domain/rules/X01Rules.ts";
import {Button} from "primereact/button";
import {RadioButton} from "primereact/radiobutton";
import {Dropdown} from "primereact/dropdown";

export default function OptionsX01() {
    const {state, dispatch} = useGameSetup();

    if (state.gameType !== GameType.X01) {
        return null;
    }
    const startScores: X01StartScore[] = [101, 201, 301, 501, 701, 1001];
    const outRules: { label: string, value: X01OutRule }[] = [
        {label: "Single Out", value: "SINGLE_OUT"},
        {label: "Double Out", value: "DOUBLE_OUT"},
        {label: "Master Out", value: "MASTER_OUT"}
    ];

//    const defaults = {startScore: 501, outRule: "DOUBLE_OUT", legsPerSet: 3, sets: 1};

    const bestOf = [1, 3, 5, 7, 9].map(n => ({lable: `Best of ${n}`, value: n}));

    return (
        <div>
            <hr></hr>
            <PlayerOptions/>
            <div style={{display: "grid", gap: 14}}>
                {/* Startscore */}
                <section>
                    <div style={{marginBottom: 8, fontWeight: 700}}>
                        Startscore
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                        {startScores.map(s => (
                            <Button
                                key={s}
                                label={String(s)}
                                outlined={state.options.startScore !== s}
                                onClick={() =>
                                    dispatch({
                                        type: "SET_OPTION",
                                        gameType: GameType.X01,
                                        key: "startScore",
                                        value: s,
                                    })}
                            />
                        ))}
                    </div>
                </section>

                {/* Out-Regel */}
                <section>
                    <div style={{marginBottom: 8, fontWeight: 700}}>Out-Regel</div>
                    <div style={{display: "grid", gap: 10}}>
                        {outRules.map(r => (
                            <label key={r.value} style={{display: "flex", alignItems: "center", gap: 10}}>
                                <RadioButton
                                    inputId={r.value}
                                    value={r.value}
                                    onChange={() =>
                                        dispatch({
                                            type: "SET_OPTION",
                                            gameType: GameType.X01,
                                            key: "outRule",
                                            value: r.value,
                                        })}
                                    checked={state.options.outRule === r.value}
                                />
                                <span>{r.label}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Legs pro Set */}
                <section>
                    <div style={{marginBottom: 8, fontWeight: 700}}>Legs pro Set</div>
                    <Dropdown
                        value={state.options.legsPerSet}
                        options={bestOf}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_OPTION",
                                gameType: GameType.X01,
                                key: "legsPerSet",
                                value: e.value,
                            })}
                        placeholder={"Best of ..."}
                        />
                    <div style={{opacity: 0.7, marginTop: 6}}>
                        Sieg bei <b>{Math.floor(state.options.legsPerSet / 2) + 1}</b> Legs
                    </div>
                </section>

                {/* Sets */}
                <section>
                    <div style={{ marginBottom: 8, fontWeight: 700 }}>Sets</div>
                    <Dropdown
                        value={state.options.sets}
                        options={bestOf}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_OPTION",
                                gameType: GameType.X01,
                                key: "sets",
                                value: e.value,
                            })
                        }
                        placeholder="Best of ..."
                    />
                    <div style={{ opacity: 0.7, marginTop: 6 }}>
                        Sieg bei <b>{Math.floor(state.options.sets / 2) + 1}</b> Sets
                    </div>
                </section>
            </div>
        </div>
    )
        ;
}