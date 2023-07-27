/** 
 * @param {NS} ns 
 * 
*/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];// permet de récupérer les argument passés à la commande de lancement du script
    const hack_script = "../scripts/HackOOP.js"
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
    if (args.help) {
        ns.tprint('Start the script ' + hack_script)
        ns.tprint(' with every servers in the servers array');
        ns.tprint("It's kinda hardcoded it for now");
        return;
    }
    if (ns.fileExists(hack_script)) {
        let pid_number = 0;
        for (let i = 0; i < servers.length; i++) {
            pid_number = await ns.run(hack_script, 1, servers[i])
            if (pid_number != 0) {
                ns.tprint("running script on pid " + pid_number);
            }
            else {
                ns.print("could'nt start script");
            }
        }


    }
    else {
        ns.print("file " + hack_script + " doesn't exist .");
    }
}