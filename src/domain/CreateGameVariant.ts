import {type X01Player, X01UnifiedRules, type X01VariantState} from "./rules/X01UnifiedRules.ts";
import {type CricketPlayer, CricketUnifiedRules, type CricketVariantState} from "./rules/CricketUnifiedRules.ts";
import type {UnifiedGameState} from "./model/UnifiedGameState.ts";
import {
  type ShanghaiPlayer,
  ShanghaiUnifiedRules, type ShanghaiVariantState
} from "./rules/ShanghaiUnifiedRules.ts";
import type {CricketOptions, ShanghaiOptions} from "./rules/OptionsTypes.ts";
import type {SetupPlayers} from "../context/gameSetupContext.tsx";
import type {X01Options} from "./rules/X01Rules.ts";

export function createX01Game(
    players: SetupPlayers[],
    options: X01Options): UnifiedGameState<X01Player, X01VariantState> {
  const rules = new X01UnifiedRules(501, true);
  const state = {
    rules,
    status: "RUNNING",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
    x01Options: options,
  };
  return state as UnifiedGameState<X01Player, X01VariantState>;
}

export function createCricketGame(
    players: SetupPlayers[],
    options: CricketOptions = {cutThroat: false}): UnifiedGameState<CricketPlayer, CricketVariantState> {
  const rules = new CricketUnifiedRules(options);
  const state = {
    rules,
    status: "RUNNING",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
    cricketOptions: options
  };
  return state as UnifiedGameState<CricketPlayer, CricketVariantState>;
}

export function createShanghaiGame(
    players: SetupPlayers[],
    options: ShanghaiOptions = {includeBull: false}
): UnifiedGameState<ShanghaiPlayer, ShanghaiVariantState> {
  const rules = new ShanghaiUnifiedRules(options);

  const state = {
    status: "RUNNING",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
    rules,
    shanghaiOptions: options,
    shanghaiTurn: {
      round: 1,
      dartInTurn: 0,
      hitSingle: false,
      hitDouble: false,
      hitTriple: false,
    },
  };

  return state as UnifiedGameState<ShanghaiPlayer, ShanghaiVariantState>
}