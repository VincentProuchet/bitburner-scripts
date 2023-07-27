/**
 * effectue weaken en continue 
 * sur le serveur dont le nom est passé en paramètre
 * ou sur la machine hote
 * 
 * @param {NS} ns
*/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    var hostname = args._[0];
    // permet de récupérer les arguments 
    // passés au script

    if (args.help || !hostname) {
        // make a help description using 
        ns.tprint(' ce script effectue la commande weaken en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        ns.tprint(" et continue tant que le niveau de sécurité n'est pas inférieur");
        ns.tprint(" au niveau de securité minimal du serveur relevé d'un seuile ");
        return 0;
    }
    

    var minSecurityLevel = ns.getServerMinSecurityLevel(hostname)+ 0.02;
   do{
        await ns.weaken(hostname);        
    }while ( ns.getServerSecurityLevel(hostname) > minSecurityLevel );
    let securityLevel = ns.getServerSecurityLevel(hostname);
    ns.print("INFO security level of " + hostname + " back to " + securityLevel);
    return 0;
}