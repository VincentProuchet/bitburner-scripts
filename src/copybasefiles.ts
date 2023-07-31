/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutocompleteData, NS, Server } from "../NetscriptDefinitions";



let target: Server;
let target_name = "";
let serveur_name = "home";

let ns2: NS
const script_directory = "./hack/"
const hack_script_name = "hack.js";
let hack_script_mem_cost = 0;
const weaken_script_name = "weaken.js";
let weaken_script_mem_cost = 0;
const grow_script_name = "grow.js";
let grow_script_mem_cost = 0;

let ram_min = 0;
let ram_max = 0;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns2 = ns;
    const args = ns2.flags([
        ['help', false]
        , ['s', "home"] // server d'ou sont lancés le script
        , ['c', ""] // serveur cible des scripts
        , ['m', 8] // memoir maximale authorizé pour le lancement des scripts
    ]);
    // premier paramètre est la cible
    try {
        ram_max = Number.parseInt(args.m.toString());
    }
    catch (err) {
        ns.tprint("la memoire doit être un nombre");
        return 1;
    }
    if (ram_max % 8 != 0) {
        ns.tprint("la mémoire doit être un multiple de 8 \n elle est exprimée en GB");
        return 1;
    }

    target_name = args.c.toString();
    if (args.help || !args.c) {
        ns.tprint('tu a oublié la cible ');
        ns.tprint("du coup je t'affiche cette aide ;)");
        return 0;
    }
    if (target_name == "home") {
        ns.tprint(` On va dire qu'on a rien vu `);
        ns.tprint(` que tu n'as pas tenté de copier les script de hack de base sur home `);
        return 1;
    }

    serveur_name = args.s.toString();
    let server = ns.getServer(serveur_name);
    // test de l'exitence des script sur home
    if (!testScriptsExistance("home")) {
        return 1;
    }
    // cinitialisation des besoin en mémoire
    hack_script_mem_cost = ns.getScriptRam(`${script_directory}${hack_script_name}`, serveur_name);
    grow_script_mem_cost = ns.getScriptRam(`${script_directory}${grow_script_name}`, serveur_name);
    weaken_script_mem_cost = ns.getScriptRam(`${script_directory}${weaken_script_name}`, serveur_name);
    ram_min = hack_script_mem_cost + grow_script_mem_cost + weaken_script_mem_cost;

    // controle de l'esxigence mémoire
    if (target.maxRam < ram_min) {
        printError(`you need ${ram_min} to runs necessary scripts`);
        return 1;
    }
    if (target_name == "") {
        target_name = ns2.getHostname();
    }
    if (target_name == "home") {
        printError(" you can't attack home");
        return 1;
    }
    target = ns2.getServer(target_name);


    if (!target.hasAdminRights) {
        printError(" no admin right on target server ");
        return 1;
    }
    if (!testScriptsExistance(serveur_name)) {

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




    if (server.purchasedByPlayer) {
        startSciptsOnPlayerServer();
    }
    else {
        startSciptsOntarget();
    }



}






/**
 * teste l'existence des script necessaires au fonctionnement 
 * du programme 
 * provoque l'affichage d'une erreur dans le terminal 
 * @returns Boolean
 */
function testScriptsExistance(target: string) {

    if (!ns2.fileExists(script_directory + hack_script_name, target)) {
        printError(" No hack script.");
        return false;
    }
    if (!ns2.fileExists(script_directory + weaken_script_name, target)) {
        printError(" No weaken script.");
        return false;
    }
    if (!ns2.fileExists(script_directory + grow_script_name, target)) {
        printError(" No grow script.");
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
    ns2.exec(`${script_directory}${hack_script_name}`, serveur_name, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${weaken_script_name}`, serveur_name, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${grow_script_name}`, serveur_name, 1, "-c", target.hostname);
}
/**
 * démarre les scripts 
destiné à l'usage sur un serveur possédé par le joueur
 */
function startSciptsOnPlayerServer() {
    ns2.exec(`${script_directory}${hack_script_name}`, serveur_name, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${grow_script_name}`, serveur_name, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${weaken_script_name}`, serveur_name, 1, "-c", target.hostname);

    if (ns2.getServerUsedRam(serveur_name))
        ns2.exec(`${script_directory}${weaken_script_name}`, serveur_name, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${grow_script_name}`, serveur_name, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${weaken_script_name}`, serveur_name, 1, "-c", target.hostname);
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