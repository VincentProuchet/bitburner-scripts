"use strict";
/**
 * contient les valeurs liées aux scripts
 * 
 */
export default class ScriptValues {
    /**@Type{NS}*/
    ns;
    /**@type{String} */
    script_host
    /**@type{String} */
    script_directory = "./scripts/";
    /**@type{String} */
    class_directory = "./scripts/classes/";
    /**@type{String} */
    hack_directory = "./scripts/hack/";
    /**@type{String} */
    hack_script_name = "hack.js";
    /**@type{String} */
    weaken_script_name = "weaken.js";
    /**@type{String} */
    grow_script_name = "grow.js";

    /** collections des noms de scripts */
    scripts = [
        this.hack_script_name
        ,this.weaken_script_name
        ,this.grow_script_name
    ];

    /** 
     * @param{NS} ns
     */
    constructor(ns, hostname = "home") {
        this.ns = ns;
        this.hostname = hostname;
    }

    /**
     * teste l'existence des scripts 
     * reférencés dans la classe
     * @returns Boolean
     */
    testScriptsExistance() {
        // on déclare la valeur de retour à vraie
        var test = true;
        this.scripts.forEach(
            (value) => {
                // il suffit qu'un seul fichier n'existe pas 
                if (!this.ns.fileExists(this.script_directory + value)) {
                    // pour que la valeur de retour devienne fausse
                    test = false;
                }

            }, this
        );
        return test;

    }
}