/* eslint-disable no-constant-condition */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { NS } from "../../NetscriptDefinitions";
import AutoCompletionValues from "../interface/AutoCompletionValues";

/**
 * effectue weaken en continue 
 * sur le serveur dont le nom est passé en paramètre
 * ou sur la machine hote
 * 
 * @param {NS} ns
*/
export async function main(ns: NS) {
    const args = ns.flags([
        ['help', false]
        , ['c', "home"]
    ]
    );
    const hostname = args.c.toString();

    if (args.help || !args.c) {
        // make a help description using 
        ns.tprint(' ce script effectue la commande weaken en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        return 0;
    }
    if (hostname == "home") {
        ns.tprint(' vous ne pouvez pas attaquer home ');
        return 1;
    }
    // do weaken 
    do {
        await ns.weaken(hostname);
    }
    while (true);
}
/**@argument {AutoCompletionValues} data */
export function autocomplete(data: AutoCompletionValues, args: any) {
    return [...data.servers];
}