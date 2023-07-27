"use strict"

import {ScriptValues} from "./scripts/classes/ScriptsValues.js";
/**
 * classe contenant les références aux 
 * instances de scripts
 * ciblant un serveur précis
 * l'objet s'autoconfigure avec les valeurs du serveur a attaquer


 * 
 */
export class HackTarget {
    /**
     * Serveur ciblée
     * @type{Server}
     */
    server = null;
    /**
     * instance de la classe netscript
     *  @type {NS}
     */
    ns = null;
    /**
     * collection des scripts de hack pour cette cible
     * @type {Number[]}
     */
    hack_scripts = [];
    /**
     * collection des scripts de weaken pour cette cible
     * @type {Number[]}
     */
    weaken_scripts = [];
    /**
     * collection des scripts de grow pour cette cible
     * @type {Number[]}
     */
    grow_scripts = [];
    /**
     * consommmation de memoire maximale authorisé a l'instance
     */
    memory_max = 0;
    /**
     * @type {ScriptValues}
     */
    SV = new ScriptValues();

    /**
     * @param {NS} ns
     * @param {String} target
     */
    constructor(ns, target = "") {
        this.ns = ns
        this.server = this.ns.getServer(target)
        
    }

    weakenManagement() {
        // weaken management
        weaken_scripts = check_programs_alive(weaken_scripts);
        if (weaken_scripts.length == 0) {
            // decision de démarrer un script de weaken        
            if (target.hackDifficulty > target.baseDifficulty) {
                started_script_PID = ns2.run( this.SV. script_directory + weaken_script_name, 1, target.hostname);
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
    growManagement() {
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
/**
* teste l'existence des script necessaires au fonctionnement 
* du programme 
* provoque l'affichage d'une erreur dans le terminal 
* @returns Boolean
*/
    testScriptsExistance() {
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


}