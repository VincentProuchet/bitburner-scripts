/**
 * ce script applique grow en continue 
 * sur le serveur passé en paramètre
 * ou sur son hote
 * 
 * @param {NS} ns
*/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    var hostname = args._[0];
    // permet de récupérer les arguments passés au script
    if (args.help && !hostname) {
        // make a help description using 
        // ns.tprint('comment ${hostname}');
    }
    var monney = ns.getServerMoneyAvailable(hostname);
    var monney_max = ns.getServerMaxMoney(hostname);

    while ( monney < monney_max * 0.90) {        
       monney = monney * await ns.grow(hostname);
    }
    return 0;

}