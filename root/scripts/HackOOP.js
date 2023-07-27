"use strict";
import { HackTarget } from "./scripts/classes/HackTarget.js";

/** 
 * Ce script hack le server dont le nom est passé en paramétre
 * @param {NS} ns 
 */
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    var hostname = args._[0];// permet de récupérer les argument passés à la commande de lancement du script
    if (args.help || !hostname) {
        // make a help description using 
        // ns.tprint('comment ${hostname}');
    }
    ns.tprint("starting hack target " + hostname);
    var hack = new HackTarget(ns, hostname);
    await hack.autoHack();

}