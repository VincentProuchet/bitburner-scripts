/* eslint-disable @typescript-eslint/no-unused-vars */

import { NS } from "../NetscriptDefinitions";
import HackScript from "./interface/HackScript";
import HackTarget from "./classes/HackTarget";



/**
 * ce script est censé tout automatiser
 de la recherche de serveur attaquable
 l'ouverture des ports
 l'installation de la backdoor
 la copy des script hack() weaken() grow()
sur les serveur ouverts
le démarrage de ces scripts en leur faisant attaquer une cible
qui peut tout à fait être un autre serveur 
en fonction de la mémoire disponible

 *  @param {NS} ns 
*/
export async function main(ns: NS): Promise<number> {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint("This script will launch attack on all opened servers it can find on the network.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return 0;
    }
    let targets: HackTarget[];

    return 0;
}

