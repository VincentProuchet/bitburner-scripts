// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NS } from "../NetscriptDefinitions";
/**
 * fonction recursive 
elle scanne le réseau à partir
du server
la recursivité s'arrête lorsque l'enfant scanné est identique au parent
 * @param {NS} ns 
* @param {string} parent 
 * @param {string} server 
 * @param {string[]} list 
 */
function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    // scan retourne une liste de string
    // les hostname des serveur un node en dessous du serveur scanné
    for (let child of children) {
        // si l'enfant à le même hostname que le parent
        if (parent == child) {
            // la récursivité s'arrête
            continue;
        }
        // sinon on pousse le nouveau serveur dans la liste
        list.push(child);
        // et on passe au niveau inférieur 
        // en prenant l'enfant comme nouveau parent
        scan(ns, server, child, list);
    }
}
/**
 * 
 * @param {NS} ns 
 * @returns 
 */
export function list_servers(ns) {
    const list = [];
    scan(ns, '', 'home', list);
    return list;
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script lists all servers on which you can run scripts.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const servers = list_servers(ns).filter(s => ns.hasRootAccess(s));
    for (const server of servers) {
        const used = ns.getServerUsedRam(server);
        const max = ns.getServerMaxRam(server);
        ns.tprint(`${server} is opened. ${used} GB / ${max} GB (${(100 * used / max).toFixed(2)}%)`)
    }

}