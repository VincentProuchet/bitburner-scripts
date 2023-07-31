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
censé être un tir et oublie
en identifiant le serveur d'execution et la cible
copier les scripts de hack sur le serveur d'exution si il n'y sont pas 
les executer en batch 
1 hack 1 grow 1 weaken pour un serveur non possédé pâr le joueur
1 hack 2 grow et 3 weaken pour les autres répétés autant de fois que l'autorise le 
paramètre de mémoire

mais le script plante

@param {NS} ns 
*/
export async function main(ns: NS) {
    ns2 = ns;
    const args = ns2.flags([
        ['help', false]
        , ['s', "home"] // server d'ou sont lancés le script
        , ['c', ""] // serveur cible des scripts
        , ['m', 8] // memoir maximale authorizé pour le lancement des scripts
        , ['tail', false]
    ]);
    if (args.tail) {
        ns.tail();
    }
    // premier paramètre est la cible
    try {
        ram_max = Number.parseInt(args.m.toString());
    }
    catch (err) {
        ns.tprint("la memoire doit être un nombre");
        return 1;
    }
    if (ram_max % 4 != 0) {
        ns.tprint("la mémoire doit être un multiple de 8 \n elle est exprimée en GB");
        return 1;
    }
    ns.tprint('ram set');

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
    server = ns.getServer(args.s.toString());
    ns.tprint('server ok');
    // test de l'exitence des script sur home
    if (!testScriptsExistance("home")) {
        ns.tprint("pas les scripts sur home");
        return 1;
    }

    // controle de l'esxigence mémoire
    if (server.maxRam < ram_min) {
        printError(`you need ${ram_min} to runs necessary scripts server has ${server.maxRam}`);
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
    ns.tprint('target ok')


    if (!target.hasAdminRights) {
        printError(" no admin right on target server ");
        return 1;
    }
    if (!server.hasAdminRights) {
        printError(" no admin right on execution server ");
        return 1;
    }
    if (!testScriptsExistance(server.hostname) || server.hostname != "home") {

        ns.tprint(`un des scripts est manquant sur le serveur :${server.hostname}`)
        if (ns2.scp(`${script_directory}${hack_script_name}`, server.hostname, "home")) {
            printInfo(hack_script_name + " successfuly copied on target ");
        }
        if (ns2.scp(`${script_directory}${weaken_script_name}`, server.hostname, "home")) {
            printInfo(weaken_script_name + " successfuly copied on target ");
        }
        if (ns2.scp(`${script_directory}${grow_script_name}`, server.hostname, "home")) {
            printInfo(grow_script_name + " successfuly copied on target ");
        }
    }
    // initialisation des besoin en mémoire
    hack_script_mem_cost = ns.getScriptRam(`${script_directory}${hack_script_name}`, server.hostname);
    grow_script_mem_cost = ns.getScriptRam(`${script_directory}${grow_script_name}`, server.hostname);
    weaken_script_mem_cost = ns.getScriptRam(`${script_directory}${weaken_script_name}`, server.hostname);
    ram_min = hack_script_mem_cost + grow_script_mem_cost + weaken_script_mem_cost;
    ns.tprint(` empreinte memoire ${ram_min} Gb`);


    if (server.purchasedByPlayer) {
        ns.tprint(`serveur possédé par le joueur`);
        startSciptsOnPlayerServer();
    }
    else {
        ns.tprint(`serveur non possédé par le joueur`);
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
    ns2.exec(`${script_directory}${hack_script_name}`, server.hostname, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);
    ns2.exec(`${script_directory}${grow_script_name}`, server.hostname, 1, "-c", target.hostname);
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