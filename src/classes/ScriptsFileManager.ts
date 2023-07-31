import { NS } from "../../NetscriptDefinitions";
import { ScriptName } from "/enums/ScriptNames";


interface SrciptsDescription {
    name: ScriptName;
    directory: string;
    filename: string
    host: string
}
/**
 * contient les valeurs liées aux scripts
 * 
 */
export default class ScriptsFileManager {
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
    scripts: SrciptsDescription[] = [
        {
            name: ScriptName.hack
            , directory: ScriptsFileManager.hack_directory
            , filename: `${ScriptName.hack}.js`
            , host: "home"
        }
        , {
            name: ScriptName.grow
            , directory: ScriptsFileManager.hack_directory
            , filename: `${ScriptName.grow}.js`
            , host: "home"
        }
        , {
            name: ScriptName.weaken
            , directory: ScriptsFileManager.hack_directory
            , filename: `${ScriptName.weaken}.js`
            , host: "home"
        }
    ]

    /** 
     */
    constructor(ns: NS, hostname = "home") {
        ScriptsFileManager.ns = ns;
        this.script_host = hostname;
    }


    /**
     * teste l'existence des scripts 
     * reférencés dans la classe
     * @returns Boolean
     */
    testScriptsExistance(): boolean {
        // on déclare la valeur de retour à vraie
        let test = true;
        this.scripts.forEach(
            (value) => {
                // il suffit qu'un seul fichier n'existe pas 
                if (!ScriptsFileManager.ns.fileExists(value.directory + value.filename, value.host)) {
                    // pour que la valeur de retour devienne fausse
                    test = false;
                }

            }, this
        );
        return test;

    }
}