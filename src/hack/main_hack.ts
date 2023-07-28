import { NS } from "../../NetscriptDefinitions";
import HachTarget from "classes/HackTarget";


/**
 * 
 *  @param {NS} ns 
*/
export async function main(ns: NS): Promise<number> {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint("This script will launch attack on all opened servers it can find on the network.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return 0;
    }
    let targets: [HachTarget];

    return 0;
}

