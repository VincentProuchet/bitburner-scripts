/** @param {NS} ns */
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    var hostname = args._[0];// permet de récupérer les argument passés à la commande de lancement du script
    var ram_wanted = args._[1];
    if (args.help || !hostname) {
        // make a help description using 
        // ns.tprint('comment ${hostname}');
        ns.tprint("effectue un achat de server avec le nom passé en paramétre");
        return 0;
    }
    if(ram_wanted == 0|null|undefined){
        ram_wanted = 2 ;
    }
    var player_money = ns.getServerMoneyAvailable("home");
    
    if(ns.getPurchasedServerCost(ram_wanted) > player_money){
        ns.tprint("ERROR can't buy that server");
        ns.tprint("ERROR cost is "+ns.getPurchasedServerCost(ram_wanted) );
        ns.tprint ("ERROR for a server with " + ram_wanted + " Gb of ram." );
        return 1;
    }
    else{
        hostname = ns.purchaseServer(hostname,ram_wanted);
    }
    if(hostname == ""){
        ns.tprint("ERROR couldn't buy that server");
    }
}