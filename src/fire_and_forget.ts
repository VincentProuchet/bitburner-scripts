/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutocompleteData, NS, ScriptArg, Server } from "../NetscriptDefinitions";



let target: Server;
let target_name = "";
let server: Server;

let args: { [key: string]: ScriptArg | string[]; };

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
    args = ns2.flags([
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

    if (args.help || !args.c) {
        printHelp();
        return 0;
    }
    target_name = args.c.toString();
    server = ns.getServer(args.s.toString());
    ns.tprint('server ok');
    target = ns2.getServer(target_name);

    if (!controlScriptBaseConditions()) {
        printError(`
        les conditions de bases ne sont pas remplies, le programme s'arrête        
        `);
        return 1;
    }
    ns.tprint('cible ok')



    // la copie des scripts n'est faite que si aucuns des scripts n'est manquant
    // ou si le server demandé n'est pas home
    if (!testScriptsExistance(server.hostname
        , hack_script_name, weaken_script_name, grow_script_name
    ) || server.hostname != "home") {

        ns.tprint(`un des scripts est manquant sur le serveur :${server.hostname}`)
        await ns.sleep(500);
        copyScriptOnServer(server.hostname
            , hack_script_name, weaken_script_name, grow_script_name
        );

    }
    // initialisation des besoin en mémoire
    hack_script_mem_cost = ns.getScriptRam(`${script_directory}${hack_script_name}`, server.hostname);
    grow_script_mem_cost = ns.getScriptRam(`${script_directory}${grow_script_name}`, server.hostname);
    weaken_script_mem_cost = ns.getScriptRam(`${script_directory}${weaken_script_name}`, server.hostname);
    ram_min = hack_script_mem_cost + grow_script_mem_cost + weaken_script_mem_cost;
    ns.tprint(` empreinte memoire ${ram_min} Gb`);
    await ns.sleep(500);
    // controle de l'exigence mémoire
    if (server.maxRam < ram_min) {
        printError(`manque de mémoire pour les scripts , disponible : ${server.maxRam} Gb`);
        return 1;
    }


    if (server.purchasedByPlayer) {
        ns.tprint(`serveur possédé par le joueur`);
        await ns.sleep(500);
        await startSciptsOnPlayerServer();
    }
    else {
        ns.tprint(`serveur non possédé par le joueur`);
        await ns.sleep(500);
        startSciptsOntarget();
    }

    return 0;

}





/**
 * teste l'existence des scripts demandées 
 * sur la cible
 * @param t cible hostname
 * @param scripts scripts 
 * @returns 
 */
function testScriptsExistance(t: string, ...scripts: string[]): boolean {
    let response = true;
    for (let s of scripts) {
        if (!ns2.fileExists(`${script_directory}${s}`, t)) {
            printError(`le script ${s} est absent sur ${t}`);
            response = false;
        }
    }
    return response;
}
/**
 * copie le/les scripts sur le serveur cible
    depuis home
    n'exécuteras pas de copie vers home
 * @param s server cible  hostname
 * @param scripts 
 */
function copyScriptOnServer(s: string, ...scripts: string[]): void {
    if (s == "home") {
        return;
    }
    for (let sc of scripts) {
        if (ns2.scp(`${script_directory}${sc}`, s, "home")) {
            printInfo(`${sc} copié sur le serveur.`);
        }
    }
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
async function startSciptsOnPlayerServer() {
    let free_ram = 0;
    do {
        ns2.exec(`${script_directory}${hack_script_name}`, server.hostname, 1, "-c", target.hostname);
        ns2.exec(`${script_directory}${grow_script_name}`, server.hostname, 1, "-c", target.hostname);
        ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);

        ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);
        ns2.exec(`${script_directory}${weaken_script_name}`, server.hostname, 1, "-c", target.hostname);
        ns2.exec(`${script_directory}${grow_script_name}`, server.hostname, 1, "-c", target.hostname);

        await ns2.sleep(1000);
        server = ns2.getServer(server.hostname);
        ns2.tprint(`memoir restante ${free_ram = server.maxRam - server.ramUsed}`);

    }
    while ((free_ram) > ram_min);
}
/**
 * controle des conditions de fonctionnement du script

 * @returns  boolean mais à terme elle devrait lancer des Exceptions
 */
function controlScriptBaseConditions(): boolean {
    if (target_name == "home" || target_name == "") {
        ns2.tprint(` On va dire qu'on a rien vu `);
        ns2.tprint(` que tu n'as pas tenté de cibler home `);
        return false;
    }
    // test de l'exitence des script sur home
    if (!testScriptsExistance("home"
        , hack_script_name, weaken_script_name, grow_script_name
    )) {
        ns2.tprint("pas les scripts sur home");
        return false;
    }
    if (!target.hasAdminRights) {
        printError(` Droits administrateur manquants sur ${target.hostname}`);
        return false;
    }
    if (!server.hasAdminRights) {
        printError(` Droits administrateur manquants sur ${server.hostname}`);
        return false;
    }

    return true;
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

function printHelp(): void {
    ns2.tprint(`
        le script copie les scripts
        hack.js, grow.js, weaken.js 
        sur le serveur -s passé en paramétre
        puis les exécute en ciblant la cible -c
        en utilisant la totalité de mémoire disponible sur le serveur
        ex run ${ns2.getScriptName()} -s home -c foodnstuff 
    `);
}



export function autocomplete(data: AutocompleteData, args: any) {
    return ['--help', "-c", "-s", "-m", "--tail", ...data.servers]; // This script autocompletes the list of servers.
}