import { X01UnifiedRules } from "./rules/X01UnifiedRules.ts";
import {type CricketOptions, CricketUnifiedRules} from "./rules/CricketUnifiedRules.ts";
import type { UnifiedGameState } from "./model/UnifiedGameState.ts";

export function createX01Game(players: { id: string; name: string }[]): UnifiedGameState {
  const rules = new X01UnifiedRules(501, true);
  return {
    rules,
    status: "SETUP",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
  };
}

export function createCricketGame(
    players: { id: string; name: string }[],
    options: CricketOptions = {cutThroat: false}): UnifiedGameState {
  const rules = new CricketUnifiedRules(options);
  return {
    rules,
    status: "SETUP",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
  };
}