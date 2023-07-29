import { NS } from "../../NetscriptDefinitions";

/**
 * contient les valeurs liées aux scripts
 * 
 */
export default class ScriptValues {
    /** instance de netscript */
    static ns: NS;
    /**
         hote des scripts de l'instance
         serveur ou se trouve les scripts
    */
    script_host: string;
    /**
        repertoire des scripts
     */
    static script_directory = "./scripts/";
    /**
        repertoire des classes
     */
    static class_directory = "./scripts/classes/";
    /**  
        repertoire des scripts de hack
    */
    static hack_directory = "./scripts/hack/";
    /** 
        nom du fichier de script de hack
    */
    static hack_script_name = "hack.js";
    /** 
    nom du fichier du script de weaken
    */
    static weaken_script_name = "weaken.js";
    /**
        nom du fichier du script de grow
     */
    static grow_script_name = "grow.js";

    /** 
        collections des noms de scripts 
        utilisée pour l'autotest de l'existance des scripts
    */
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