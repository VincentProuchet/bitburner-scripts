import { NS } from "../NetscriptDefinitions";
import AutoCompletionValues from "./interface/AutoCompletionValues";

export async function main(ns: NS): Promise<number> {
    const args = ns.flags([
        ["help", false]
        , ["script", ""]
    ]);
    const script = args.script.toString();

    if (args.help || args.script == "") {
        ns.tprint("il n'y a rien a voir ici")
        ns.tprint("ce programme s'utilise en passant des argument nommés")
        ns.tprint(` de la forme :`)
        ns.tprint(` run ${ns.getScriptName()} --script nomduscript `)
        ns.tprint("ou :")
        ns.tprint(` run ${ns.getScriptName()} --help `)
        ns.tprint("notez que vous pouvez chercher aussi des dossiers ou des fichier sans extension")
        return 0;
    }
    ns.tprint(ns.ls(ns.getHostname(), script));

    return 1;
}
/**
 * autocompletion pour le terminal du jeu
 * @param data 
 * @param args 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data: AutoCompletionValues, args: string[]): string[] {
    return ["--help", "--script", ...data.scripts]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.

}