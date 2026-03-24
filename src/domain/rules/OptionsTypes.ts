import {GameType} from "../../lib/constants.ts";

export type CricketOptions = {
    cutThroat: boolean; // vermutlich meinst du "Cut Throat"
};

export type X01Options = {
    startScore: 101 | 201 | 301 | 501 | 701 | 1001;
    singleOut: boolean;
    doubleOut: boolean;
    masterOut: boolean;
}

export type ShanghaiOptions = {
    includeBull: boolean; // optional: Runde 21 = Bull (25)
};

export type GameOptionsByType = {
    [GameType.CRICKET]: CricketOptions;
    [GameType.X01]: X01Options;
    [GameType.SHANGHAI]: ShanghaiOptions;
}