/* eslint-disable no-constant-condition */
import { NS } from "../../NetscriptDefinitions";
import AutoCompletionValues from "/interface/AutoCompletionValues";


/**
 * ce script applique grow en continue 
 * sur le serveur passé en paramètre
 * 
 * @param {NS} ns
*/
export async function main(ns: NS) {
    const args = ns.flags([
        ['help', false]
        , ['c', "home"]
    ]);
    const hostname = args.c.toString();

    if (args.help || !args.c) {
        ns.tprint(' ce script effectue la commande grow en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        return 0;
    }
    if (hostname == "home") {
        ns.tprint(' vous ne pouvez pas attaquer home ');
        return 1;
    }
    do {
        await ns.grow(hostname);
    }
    while (true);
}
/**@argument {AutoCompletionValues} data */
export function autocomplete(data: AutoCompletionValues, args: any) {
    return ['help', "c", ...data.servers];
}