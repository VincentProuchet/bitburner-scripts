// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NS } from "../NetscriptDefinitions";
/**
 * 
 * @param {NS} ns 
 * @param {string} parent 
 * @param {string} server 
 * @param {string[]} list 
 */
function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);

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
/**
 * 
 * @param {NS} ns 
 * @returns 
 */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script helps you find an unsolved coding contract.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    let servers = list_servers(ns);
    const boughtServers = ns.getPurchasedServers(ns);
    servers = servers.filter(s => !boughtServers.includes(s));
    const hostname = servers.find(s => ns.ls(s).find(f => f.endsWith(".cct")))
    if (!hostname) {
        ns.tprint("No coding contract found.");
        return;
    }

    ns.tprint(`Found coding contract on '${hostname}'.`)
}