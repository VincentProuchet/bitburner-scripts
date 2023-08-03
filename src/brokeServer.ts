/* eslint-disable no-fallthrough */
import { NS, Server } from "@ns";
import AutoCompletionValues from "./interface/AutoCompletionValues";
/**
 * ce script effectue une attaque complete du serveur ciblé 
par le paramètre -s
 * @param ns 
 */
export async function main(ns: NS): Promise<number> {
    const args = ns.flags([
        ["help", false]
        , ["s", ""]
    ]);
    const server = ns.getServer(args.s.toString());
    const player = ns.getPlayer();

    if (!testscriptCondition(ns, server)) {
        ns.tprint(`les condition de fonctionnement de sont pas tenues`);
        return 1;
    }
    try {

        switch (server.numOpenPortsRequired) {
            case 5:
                ns.sqlinject(server.hostname);
            case 4:
                ns.httpworm(server.hostname);
            case 3:
                ns.relaysmtp(server.hostname);
            case 2:
                ns.ftpcrack(server.hostname);
            case 1:
                ns.brutessh(server.hostname);
            default:
                ns.nuke(server.hostname);
                break;
        }
    }
    catch (err) {
        ns.tprint(`l'une des opération necessaire à l'ouverture du nombre de ports demandé n'est pas disponible`);
        return 1;
    }

    if ((server.hackDifficulty != undefined ? server.hackDifficulty : 0) < player.skills.hacking) {
        ns.run(`fire_and_forget.js`, 1, '-s', server.hostname, '-c', server.hostname);
    }

    return 0;
}

function testscriptCondition(ns: NS, server: Server): boolean {
    if (server.purchasedByPlayer) {
        ns.tprint(`serveur possédé par le joueur`);
        return false;
    }
    if (server.hasAdminRights) {
        ns.tprint(`serveur déjà brisé`);
        return false;
    }

    return true;
}


/**
 * autocompletion pour le terminal du jeu
 * @param data 
 * @param args 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data: AutoCompletionValues, args: string[]): string[] {
    return ["--help", "-s", ...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.

}