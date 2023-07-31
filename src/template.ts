import { NS } from "@ns";
import AutoCompletionValues from "./interface/AutoCompletionValues";

export async function main(ns: NS): Promise<void> {
  const args = ns.flags([]);
  ns.tprint(args);
  ns.tprint("Hello Remote API!");
}
/**
 * autocompletion pour le terminal du jeu
 * @param data 
 * @param args 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data: AutoCompletionValues, args: string[]): string[] {
  return ["help", ...data.servers]; // This script autocompletes the list of servers.
  return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
  return ["low", "medium", "high"]; // Autocomplete 3 specific strings.

}