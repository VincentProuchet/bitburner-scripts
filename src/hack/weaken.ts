// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { NS } from "../../NetscriptDefinitions";

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
        , ['hostname', false]
    ]
    );
    const hostname = args.hostname.toString();
    // permet de récupérer les arguments 
    // passés au script

    if (args.help || !args.hostname) {
        // make a help description using 
        ns.tprint(' ce script effectue la commande weaken en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        ns.tprint(" et continue tant que le niveau de sécurité n'est pas inférieur");
        ns.tprint(" au niveau de securité minimal du serveur relevé d'un seuil ");
        return 0;
    }
    if (hostname == "home") {
        ns.tprint(' vous ne pouvez pas attaquer home ');
        return 1;
    }
    const minSecurityLevel = ns.getServerMinSecurityLevel(hostname) + 0.02;
    if (minSecurityLevel == 0) {
        ns.print("ERROR la securité minimale de " + hostname + " est de 0 vous ne pouvez pas l'attaquer");
        return 1;
    }
    // do weaken 
    do {
        await ns.weaken(hostname);
    } while (ns.getServerSecurityLevel(hostname) > minSecurityLevel);
    ns.print("INFO security level of " + hostname + " back to " + ns.getServerSecurityLevel(hostname));

    return 0;
}