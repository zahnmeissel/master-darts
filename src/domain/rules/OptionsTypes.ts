import {GameType} from "../../lib/constants.ts";
import type {X01Options} from "./X01Rules.ts";

export type CricketOptions = {
    cutThroat: boolean; // vermutlich meinst du "Cut Throat"
};

export type ShanghaiOptions = {
    includeBull: boolean; // optional: Runde 21 = Bull (25)
};

export type GameOptionsByType = {
    [GameType.CRICKET]: CricketOptions;
    [GameType.X01]: X01Options;
    [GameType.SHANGHAI]: ShanghaiOptions;
}