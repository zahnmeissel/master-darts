export type X01StartScore = 101 | 201 | 301 | 501 | 701 | 1001;
export type X01OutRule = "SINGLE_OUT" | "DOUBLE_OUT" | "MASTER_OUT";

export type X01Options = {
    startScore: X01StartScore;
    outRule: X01OutRule;

    legsPerSet: number;
    sets: number;
}