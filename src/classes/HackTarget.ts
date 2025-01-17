/* eslint-disable prefer-const */

import ScriptsValues from "/classes/ScriptsFileManager";
import { NS, Server } from "../../NetscriptDefinitions";
import HackScript from "../interface/HackScript";
import ScriptsFileManager from "/classes/ScriptsFileManager";
/**
 * classe contenant les références aux 
 * instances de scripts
 * ciblant un serveur précis
 * l'objet s'autoconfigure avec les valeurs du serveur a attaquer
 * 
 */
export default class HackTarget {
    /**
     * Serveur ciblée
     */
    target: Server;
    /**
     * instance de la classe netscript
     */
    ns: NS;
    /**
    instance de ScriptValues 
    */
    SV: ScriptsFileManager
    /**
     * collection des scripts de hack pour cette cible
     */
    hack_scripts: HackScript[] = [];
    /**
     * collection des scripts de weaken pour cette cible
     */
    weaken_scripts: HackScript[] = [];
    /**
     * collection des scripts de grow pour cette cible
     */
    grow_scripts: HackScript[] = [];
    /**
     * consommmation de memoire maximale authorisé a l'instance
     */
    memory_max = 0;


    /**
     * @param {NS} ns instance de netscript 
     * @param {String} target cible
     */
    constructor(ns: NS, target = "") {
        this.ns = ns;
        this.SV = new ScriptsValues(ns, target);
        this.target = this.ns.getServer(target);
    }
    /**
     * controle les scripts de weaken 
    * démarre des scripts de weaken 
    * selon le calcul d'une tendance 
    * et d'une prioritée    
     * @returns {void}
     */
    weakenManagement(): void {
        if (this.target.hackDifficulty == undefined || this.target.baseDifficulty == undefined) {
            return;
        }
        // weaken management
        this.weaken_scripts = this.check_programs_alive(this.weaken_scripts);
        if (this.weaken_scripts.length == 0) {
            // decision de démarrer un script de weaken        
            if (this.target.hackDifficulty > this.target.baseDifficulty) {
                let started_script = this.ns.run(ScriptsValues.script_directory
                    + ScriptsValues.weaken_script_name, 1, this.target.hostname, this.target.hostname);

                if (started_script > 0) {
                    // on garde une référence au script lancé en mémoire
                    this.weaken_scripts.push(
                        {
                            pid: started_script
                            , source: this.target.hostname
                        }
                    );

                }
                else {
                    // do nothing
                }
            }

        }
    }
    /**
     * controle les scripts de grow
    * démarre des scripts de grow si necessaire
    * basé sur le calcul d'une tendence et d'une prioritée
     * @returns {void}
     */
    growManagement(): void {

        // grow management
        this.grow_scripts = this.check_programs_alive(this.grow_scripts);
        if (this.target.moneyAvailable == undefined || this.target.moneyMax == undefined) {
            return;
        }
        if (this.grow_scripts.length == 0) {
            // décision de démarrer un script de grow
            if (this.target.moneyAvailable < this.target.moneyMax * 0.9) {
                let started_script = this.ns.run(ScriptsValues.script_directory
                    + ScriptsValues.grow_script_name, 1, this.target.hostname, this.target.hostname);

                if (started_script > 0) {
                    // on garde une référence au script lancé en mémoire
                    this.grow_scripts.push(
                        {
                            pid: started_script
                            , source: this.target.hostname
                        });
                }
            }


        }
    }

    /**
    * controle les scripts de hack
    * démarre des scripts si necessaire
    * basé sur le calcul d'une tendence et d'une prioritée
    * @returns {void}
    */
    hackManagement(): void {
        let started_script = this.ns.run(ScriptsValues.script_directory
            + ScriptsValues.hack_script_name, 1, this.target.hostname, this.target.hostname);

        if (started_script > 0) {
            // on garde une référence au script lancé en mémoire
            this.hack_scripts.push(
                {
                    pid: started_script
                    , source: this.target.hostname
                });
        }
    }

    /**
    * controle la liste de nombre 
    * en tant que program PID
     * @param {HackScript[]} target tableau de nombres
     * @returns {HackScript[]} seulement les  programmes en cours d'exécution
     */
    check_programs_alive(targets: HackScript[]): HackScript[] {

        return targets.filter(
            (value) => {
                return (this.ns.isRunning(value.pid, value.source));
            }
        );
    }

}