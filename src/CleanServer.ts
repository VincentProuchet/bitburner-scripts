
import { NS } from "@ns";
import AutoCompletionValues from "./interface/AutoCompletionValues";


/**
 * ce script efface les fichier sur un serveur 
il n'efface que les scripts
mais il effaceras tous les scripts
 * @param netscript 
 * @returns 
 */
export async function main(ns: NS): Promise<number> {

    const args = ns.flags([
        ['help', false]
        , ['cible', ""]
    ]);
    ns.tprint(args);
    if (args.help || !args.cible) {
        ns.tprint(' ce script effectue la commande grow en boucle ');
        ns.tprint(' sur le serveur dont le hostname est passé en argument ');
        return 0;
    }

    const hostname = args.cible.toString();
    // permet de récupérer les arguments passés au script
    if (hostname == "home") {
        ns.tprint(' vous ne pouvez pas effacer les scripts sur home ');
        return 1;
    }
    // on arrête tous les script de la machine concerné
    ns.killall(hostname);
    // la commmande "ls" utilisé par les script 
    // permet de liste tous les fichier 
    //contenant une chaine de carractére précise
    // ici l'extension .js
    const files = ns.ls(hostname, '.js');

    files.forEach(element => {

        if (ns.rm(element, hostname)) {
            ns.tprint(`INFO successfully deleted file ${element} on ${hostname}`);
        }
        else {
            ns.tprint(`ERROR failt to deleted file ${element} on ${hostname}`);
        }
    });
    return 0;
}

/**
 * autocompletion pour le terminal du jeu
 * @param data 
 * @param args 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data: AutoCompletionValues, args: string[]): string[] {
    return ['help', "cible", ...data.servers]; // This script autocompletes the list of servers.
}