/**
 * ce script lance des hack continue sur la machine cible
 * (ou la machine hôte)
 * il appelle automatique les scripts
 * weaken.js et grow.js
 * en fonction des paramètres d'execution
 * 
 * La séparation des fonction Grow et weaken sur plusieurs
 * scripts est dût à lobservation 
 * que le fonctionnement automatique en mode hors ligne
 * tend à se contenter de répéter en boucle le dernier 
 * (entre hack, weaken et grow 
 * à avoir été executé.
 *  @param {NS} ns 
*/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];// permet de récupérer les argument passés à la commande de lancement du script
    var hackit = true;
    if (args.help && !hostname) {
        // make a help description using 
        // ns.tprint('comment ${hostname}');
    }
    do {
        await ns.hack(hostname);
    } while (hackit);

}