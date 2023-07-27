"use strict";


/**
 * @type {NS}
 */
var ns2 = null;
/** temps d'arret du script entre deux boucles */
var sleepTime = 5000;

var script_directory = "/scripts/hack/";

var hack_script_name = "hack.js";
var hack_script_mem_cost = 0;
var weaken_script_name = "weaken.js";
var weaken_script_mem_cost = 0;
var grow_script_name = "grow.js";
var grow_script_mem_cost = 0;
/**@type {Number} */
var started_script_PID = 0;
/**@type {[Number]} */
var hack_scripts = [];
/**@type {[Number]} */
var weaken_scripts = [];
/**@type {[Number]} */
var grow_scripts = [];

var ram_used = 0;
var ram_max = 0;
var ram_usage_auth = 0;

/**@type {Server}*/
var target = null;

/**
 * attaque le serveur :
 * - dont le nom est passé en paramétre
 * - l'hote du script
 * 
 * en surveillant l'état du serveur
 * lançant des script 
 *  de hack
 *  de grow
 *  de weaken
 * @param {NS} ns 
*/
export async function main(ns) {
    ns2 = ns;
    const args = ns2.flags([['help', false]]);
    // premier paramètre est la cible
    let target_name = args._[0];
    /**
     * le second et la quantité de mémoire maximale que le script est 
     * authorisé a utilisé en GB
     * si null/undefined ou 0 
     * le script utiliserat la totalité de la mémoire disponible sur le serveur a son lancement
     * l'entrée d'une valeur inférieure à la somme de mémoire necessaire pour lancer les 
     * quatres script (ce script, hack, weaken et grow )
     * provoquerat l'affichage d'un message d'information et l'arrêt du script
     * (le temps que j'aprenne à faire des prompts)
    */
    ram_usage_auth = args._[1];

    // permet de récupérer les arguments 
    // passés au script

    if (args.help && !target_name) {

        ns.tprint('comment ${hostname}');
        return 0;
    }
    if (target_name == null || target_name == undefined) {
        target_name = ns2.getHostname();
    }
    if (target_name == "home") {
        printError(" you can't attack home");
        return 1;
    }

    target = ns2.getServer(target_name);

    if (!testScriptsExistance()) {
        return 1;
    }
    initScriptsVars();

    // run the hack 
    started_script_PID = ns2.run(script_directory + hack_script_name, 1, target.hostname);
    if (started_script_PID == 0) {
        printError("couldn't start hack script ");
    }
    else {
        hack_scripts.push(started_script_PID);
        ns2.tprint("started hack script witn PID : " + started_script_PID);
    }

    do {
        // refresh des données de la cible
        target = await ns2.getServer(target.hostname);

        await weakenManagement();
        await growManagement();

        await ns2.sleep(sleepTime);

    } while (true);




}/**
 * affiche message dans le terminal
 * @param {NS} ns 
 * @param {String} message
 */
function printError(message) {
    ns2.tprint("ERROR " + message);
}
/**
 * teste l'existence des script necessaires au fonctionnement 
 * du programme 
 * provoque l'affichage d'une erreur dans le terminal 
 * @returns Boolean
 */
function testScriptsExistance() {
    if (!ns2.fileExists(script_directory + hack_script_name)) {
        printError(" No hack script.");
        return false;
    }
    if (!ns2.fileExists(script_directory + weaken_script_name)) {
        printError(" No weaken script.");
        return false;
    }
    if (!ns2.fileExists(script_directory + grow_script_name)) {
        printError(" No grow script.");
        return false;
    }
    ns2.tprint("INFO " + " All scripts validated ");
    return true;
}
/**
 * initialise les variables des scripts
 */
function initScriptsVars() {
    hack_script_mem_cost = ns2.getScriptRam(script_directory + hack_script_name);
    weaken_script_mem_cost = ns2.getScriptRam(script_directory + weaken_script_name);
    grow_script_mem_cost = ns2.getScriptRam(script_directory + grow_script_name);

    if (ram_usage_auth == 0) {
        ram_usage_auth == ram_max;
    }
}
/**
 * check a list of numbers as program PID
 * retrun the list with only still running programs
 * @type {Int16Array} targets
 * @returns {[Number]}
 */
function check_programs_alive(targets = [Number]) {
    return targets.filter(
        (value) => {
            if (value == 0 | null | undefined) {
                return false;
            }
            return (ns2.isRunning(value));
        }
    );
}
/**
 * 
 */
function weakenManagement() {
    // weaken management
    weaken_scripts = check_programs_alive(weaken_scripts);
    if (weaken_scripts.length == 0) {
        // decision de démarrer un script de weaken        
        if (target.hackDifficulty > target.baseDifficulty) {
            started_script_PID = ns2.run(script_directory + weaken_script_name, 1, target.hostname);
            if (started_script_PID > 0) {
                // on garde une référence au script lancé en mémoire
                weaken_scripts.push(started_script_PID);
                ns2.tprint("started weaken script witn PID : " + started_script_PID);
                started_script_PID = 0;
            }
            else {
                printError(" Couldn't start weaken script ");
            }
        }

    }
}
/**
 * 
 */
function growManagement() {
    // grow management
    grow_scripts = check_programs_alive(grow_scripts);
    if (grow_scripts.length == 0) {
        // décision de démarrer un script de grow
        if (target.moneyAvailable < target.moneyMax * 0.9) {
            started_script_PID = ns2.run(script_directory + grow_script_name, 1, target.hostname);
            if (started_script_PID > 0) {
                // on garde une référence au script lancé en mémoire
                grow_scripts.push(started_script_PID);
                ns2.tprint("started grow script witn PID : " + started_script_PID);
                started_script_PID = 0;
            }
            else {
                printError(" Couldn't start grow script ");
            }
            started_script_PID = 0;

        }
    }
}
/**@argument{Data}data */
export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    // return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    // return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}