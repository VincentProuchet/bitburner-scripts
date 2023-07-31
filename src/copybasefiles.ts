/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutocompleteData, NS, Server } from "../NetscriptDefinitions";



let target: Server;
let target_name = "";
let server: Server;

let ns2: NS
const script_directory = "./hack/";
const hack_script_name = "hack.js";
let hack_script_mem_cost = 0;
const weaken_script_name = "weaken.js";
let weaken_script_mem_cost = 0;
const grow_script_name = "grow.js";
let grow_script_mem_cost = 0;
// consommation calculée et combinée minimales des scripts
let ram_min = 0;
// maximum de mémoire authorizé pour l'execution des scripts
let ram_max = 0;


/**
copy les scripts de base pour le hack
hack.js 
grow.js
weaken.js

et les démarre sur le serveur cible
 @param {NS} ns */
export async function main(ns: NS) {
    ns2 = ns;
    const args = ns2.flags([
        ['help', false]
        , ['c', ""] // serveur cible des scripts

    ]);
    if (args.help || !args.c) {
        ns.tprint('tu a oublié la cible ');
        ns.tprint("du coup je t'affiche cette aide ;)");
        return 0;
    }
    target_name = args.c.toString();
    if (target_name == "home") {
        ns.tprint(` On va dire qu'on a rien vu `);
        ns.tprint(` que tu n'as pas tenté de copier les script de hack de base sur home `);
        ns.print("pire ce script aurait attaqué home ");
        return 1;
    }
    target = ns.getServer(target_name);

    if (target.purchasedByPlayer) {
        ns.tprint(`${target.hostname} est un serveur appartenant au jouueur`);
        return 1;
    }
    // test de l'exitence des script sur home
    if (!testScriptsExistance("home")) {
        ns.tprint(`scripts de base non trouvé sur home `)
        return 1;
    }
    if (!target.hasAdminRights) {
        printError(" no admin right on target server ");
        return 1;
    }
    if (!testScriptsExistance(target.hostname)) {

        if (ns2.scp(script_directory + hack_script_name, target.hostname, "home")) {
            printInfo(hack_script_name + " successfuly copied on target ");
        }
        if (ns2.scp(script_directory + weaken_script_name, target.hostname, "home")) {
            printInfo(weaken_script_name + " successfuly copied on target ");
        }
        if (ns2.scp(script_directory + grow_script_name, target.hostname, "home")) {
            printInfo(grow_script_name + " successfuly copied on target ");
        }
    }
    // initialisation des besoin en mémoire

    // hack_script_mem_cost = ns.getScriptRam(`${script_directory}${hack_script_name}`, target.hostname);
    // grow_script_mem_cost = ns.getScriptRam(`${script_directory}${grow_script_name}`, target.hostname);
    // weaken_script_mem_cost = ns.getScriptRam(`${script_directory}${weaken_script_name}`, target.hostname);
    // ram_min = hack_script_mem_cost + grow_script_mem_cost + weaken_script_mem_cost;

    else {
        startSciptsOntarget();
    }
    return 0;


}






/**
 * teste l'existence des script necessaires au fonctionnement 
 * du programme 
 * provoque l'affichage d'une erreur dans le terminal 
 * @returns Boolean
 */
function testScriptsExistance(target: string) {

    if (!ns2.fileExists(script_directory + hack_script_name, target)) {
        printError(`no script ${hack_script_name} on ${target}`);
        return false;
    }
    if (!ns2.fileExists(script_directory + weaken_script_name, target)) {
        printError(`no script ${weaken_script_name} on ${target}`);
        return false;
    }
    if (!ns2.fileExists(script_directory + grow_script_name, target)) {
        printError(`no script ${grow_script_name} on ${target}`);
        return false;
    }
    ns2.tprint("INFO " + " All scripts validated ");
    return true;
}
/**
 * démarre les scripts 
destiné à l'usage sur un serveur cible
 */
function startSciptsOntarget() {
    ns2.exec(`${script_directory}${hack_script_name}`, target.hostname, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${weaken_script_name}`, target.hostname, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${grow_script_name}`, target.hostname, 1, "-c", target.hostname);
}
/**
 * démarre les scripts 
destiné à l'usage sur un serveur possédé par le joueur
 */
function startSciptsOnPlayerServer() {
    do {

        ns2.exec(`${script_directory}${hack_script_name}`, server.hostname, 1, "-c", target.hostname);
        ns2.exec(`${script_directory}${grow_script_name}`, server.hostname, 1, "-c", target.hostname);
        ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);
        server = ns2.getServer(server.hostname);

        if ((server.maxRam - server.ramUsed) % ram_min) {

            ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);
            ns2.exec(`${script_directory}${grow_script_name}`, server.hostname, 1, "-c", target.hostname);
            ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);
        }
        server = ns2.getServer(server.hostname);
    }
    while ((server.maxRam - server.ramUsed) % ram_min);
}


/**
 * affiche message dans le terminal
 * @param {NS} ns 
 * @param {String} message
 */
function printError(message: string) {
    ns2.tprint("ERROR " + message);
}
function printInfo(message: string) {
    ns2.tprint("INFO " + message);
}
export function autocomplete(data: AutocompleteData, args: any) {
    return ['--help', "--cible", "--server", ...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}