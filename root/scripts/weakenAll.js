/** @param {NS} ns */
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];// permet de récupérer les argument passés à la commande de lancement du script
    const servers = [
        "n00dles"
        , "foodnstuff"
        , "joesguns"
        , "hong-fang-tea"
        , "sigma-cosmetics"
        , "harakiri-sushi"
        , "nectar-net"
        , "max-hardware"
    ]; 
     if(args.help && !hostname) {
        // make a help description using 
        // ns.tprint('comment ${hostname}');
     } 
    hostname = "";
    var minSecurityLevel = 0;
    var baseSecurityLevel = 0;
    var securityLevel = 0;
    while (true) {
            for(var i=0;i<servers.length; i++)
            {
                hostname = servers[i];
                minSecurityLevel = ns.getServerMinSecurityLevel(hostname);
                baseSecurityLevel = ns.getServerBaseSecurityLevel(hostname);
                securityLevel = ns.getServerSecurityLevel(hostname);
                if (securityLevel > baseSecurityLevel) {

                    do {
                        securityLevel = securityLevel - await ns.weaken(hostname);

                    } while (securityLevel > minSecurityLevel);
                }
                ns.printf("security level of " +hostname+ " back to "+ securityLevel );

                

            }
        
        
    }
}