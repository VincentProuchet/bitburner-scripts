/* eslint-disable no-constant-condition */
import { NS } from "../../NetscriptDefinitions";
import AutoCompletionValues from "../interface/AutoCompletionValues";

/**
 * ce script lance des hack continue sur la machine cible
 * (ou la machine hôte)
 * il appelle automatique les scripts
 * weaken.js et grow.js
 * en fonction des paramètres d'execution
 * 
 * La séparation des fonction Grow et weaken sur plusieurs
 * scripts est dût à l'observation 
 * que le fonctionnement automatique en mode hors ligne
 * tend à se contenter de répéter en boucle le dernier 
 * (entre hack, weaken et grow 
 * à avoir été executé.
 *  @param {NS} ns 
*/
export async function main(ns: NS) {
    const args = ns.flags([
        ['help', false]
        , ['c', "home"]
    ]);
    const hostname = args.c.toString();

    if (args.help || !args.c) {
        ns.tprint(' ce script effectue la commande hack en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        return 0;
    }
    if (hostname == "home") {
        ns.tprint(' vous ne pouvez pas attaquer home ');
        return 1;
    }

    do {
        await ns.hack(hostname);
    } while (true);

}
/**@argument {AutoCompletionValues} data */
export function autocomplete(data: AutoCompletionValues, args: any) {
    return ["help", "c", ...data.servers];
}