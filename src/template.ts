import { NS } from "@ns";
import AutoCompletionValues from "./interface/AutoCompletionValues";

export async function main(ns: NS): Promise<number> {
  const args = ns.flags([
    ["help", false]
    , ["s", ""]
  ]);
  if (args.help || args.s) {
    printHelp(ns);
    return 1;
  }

  ns.tprint("Hello Remote API!");
  return 0;
}
/**
 * autocompletion pour le terminal du jeu
 * @param data 
 * @param args 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data: AutoCompletionValues, args: string[]): string[] {
  return ["--help", "-s", ...data.servers]; // This script autocompletes the list of servers.
  return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
  return ["low", "medium", "high"]; // Autocomplete 3 specific strings.

}

function printHelp(ns: NS): void {
  ns.tprint(` 
    ceci affiche un texte sur le terminal
    le texte est "formaté"
    puisque il conserve ses retours à la ligne
    `
  )
}