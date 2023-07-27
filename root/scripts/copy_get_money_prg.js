/** @type {Server} */
var target = null;
/**@type {NS} */
var ns2 = null;

var script_directory = "/scripts/hack/";

var main_script = "get_money.js";
var hack_script_name = "hack.js";
var hack_script_mem_cost = 0;
var weaken_script_name = "weaken.js";
var weaken_script_mem_cost = 0;
var grow_script_name = "grow.js";
var grow_script_mem_cost = 0;

var ram_used = 0;
var ram_max = 0;
var ram_usage_auth = 0;

/** @param {NS} ns */
export async function main(ns) {
    ns2 = ns;
    const args = ns2.flags([['help', false]]);
    // premier paramètre est la cible
    let target_name = args._[0];
    if (args.help || !target_name) {
        ns.tprint('tu a oublié la cible ');
        ns.tprint("du coup je t'affiche cette aide ;)");
        return 0;
    }
    // test de l'exitence des script sur home
    if (!testScriptsExistance("home")) {
        return 1;
    }
    if (target_name == null || target_name == undefined) {
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
    if (!ns2.fileExists(script_directory + hack_script_name, target.hostname)) {
        if (ns2.scp(script_directory + hack_script_name, target.hostname, "home")) {
            printInfo(hack_script_name + " successfuly copied on target ");
        }

    }
    if (!ns2.fileExists(script_directory + weaken_script_name, target.hostname)) {
        if (ns2.scp(script_directory + weaken_script_name, target.hostname, "home")) {
            printInfo(weaken_script_name + " successfuly copied on target ");
        }
    }
    if (!ns2.fileExists(script_directory + grow_script_name, target.hostname)) {
        if (ns2.scp(script_directory + grow_script_name, target.hostname, "home")) {
            printInfo(grow_script_name + " successfuly copied on target ");
        }
    }
    if (!ns2.fileExists(script_directory + main_script, target.hostname)) {
        if (ns2.scp(script_directory + main_script, target.hostname, "home")) {
            printInfo(main_script + " successfuly copied on target ");
            ns2.exec(script_directory + main_script, target.hostname, 1,target.hostname);
        }

    }
    



}

/**
 * teste l'existence des script necessaires au fonctionnement 
 * du programme 
 * provoque l'affichage d'une erreur dans le terminal 
 * @returns Boolean
 */
function testScriptsExistance(target) {
    if (!ns2.fileExists(script_directory + main_script, target)) {
        printError(" No main script at " + script_directory + main_script);
        return false;
    }
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
 * affiche message dans le terminal
 * @param {NS} ns 
 * @param {String} message
 */
function printError(message) {
    ns2.tprint("ERROR " + message);
}
function printInfo(message) {
    ns2.tprint("INFO " + message);
}
export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}