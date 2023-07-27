/** @param {NS} ns */
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    var hostname = args._[0];// permet de récupérer les argument passés à la commande de lancement du script
    
     if(args.help || !hostname){
       // make a help description using 
       // ns.tprint('comment ${hostname}');
        ns.tprint("effectue un upgrade du server dont le nom est passé en paramétre");
        
     } 
}