import { X01UnifiedRules } from "../domain/rules/X01UnifiedRules";
import { CricketUnifiedRules } from "../domain/rules/CricketUnifiedRules";
import type { UnifiedGameState } from "../domain/model/UnifiedGameState";

export function createX01Game(players: string[]): UnifiedGameState {
  const rules = new X01UnifiedRules(501, true);
  return {
    rules,
    status: "SETUP",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
  };
}

export function createCricketGame(players: string[]): UnifiedGameState {
  const rules = new CricketUnifiedRules();
  return {
    rules,
    status: "SETUP",
    currentPlayerIndex: 0,
    players: rules.initialPlayers(players),
  };
}