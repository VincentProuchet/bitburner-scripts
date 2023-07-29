import { NS } from "../../NetscriptDefinitions";

/**
 * ce script applique grow en continue 
 * sur le serveur passé en paramètre
 * 
 * @param {NS} ns
*/
export async function main(ns: NS) {
    const args = ns.flags([
        ['help', false]
        , ['hostname', false]
    ]);
    const hostname = args.hostname.toString();
    // permet de récupérer les arguments passés au script
    if (args.help || !args.hostname) {
        ns.tprint(' ce script effectue la commande grow en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        ns.tprint(" et continue tant que la quantité d'argent disponible n'est pas supérieur ");
        ns.tprint(" à 90% du niveau maximal du serveur");
        return 0;
    }
    if (hostname == "home") {
        ns.tprint(' vous ne pouvez pas attaquer home ');
        return 1;
    }
    let monney = ns.getServerMoneyAvailable(hostname);
    const monney_threshold = ns.getServerMaxMoney(hostname) * 0.90;
    if (monney_threshold == 0) {
        ns.print("ERROR le maximum d'argent possible sur " + hostname + " est de 0 vous ne pouvez pas grow ");
        return 1;
    }

    while (monney < monney_threshold) {
        monney = monney * await ns.grow(hostname);
    }
    return 0;

}