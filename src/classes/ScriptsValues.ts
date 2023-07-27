import { NS } from "../../NetscriptDefinitions";

/**
 * contient les valeurs liées aux scripts
 * 
 */
export default class ScriptValues {
    /**@Type{NS}*/
    static ns: NS;
    /**@type{String} */
    script_host: string;
    /**@type{String} */
    static script_directory = "./scripts/";
    /**@type{String} */
    static class_directory = "./scripts/classes/";
    /**@type{String} */
    static hack_directory = "./scripts/hack/";
    /**@type{String} */
    static hack_script_name = "hack.js";
    /**@type{String} */
    static weaken_script_name = "weaken.js";
    /**@type{String} */
    static grow_script_name = "grow.js";

    /** collections des noms de scripts */
    scripts = [
        ScriptValues.hack_script_name
        , ScriptValues.weaken_script_name
        , ScriptValues.grow_script_name
    ];

    /** 
     */
    constructor(ns: NS, hostname = "home") {
        ScriptValues.ns = ns;
        this.script_host = hostname;
    }


    /**
     * teste l'existence des scripts 
     * reférencés dans la classe
     * @returns Boolean
     */
    testScriptsExistance() {
        // on déclare la valeur de retour à vraie
        let test = true;
        this.scripts.forEach(
            (value) => {
                // il suffit qu'un seul fichier n'existe pas 
                if (!ScriptValues.ns.fileExists(ScriptValues.script_directory + value)) {
                    // pour que la valeur de retour devienne fausse
                    test = false;
                }

            }, this
        );
        return test;

    }
}