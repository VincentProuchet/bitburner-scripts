import { NS } from "@ns";
import AutoCompletionValues from "./interface/AutoCompletionValues";

export async function main(ns: NS): Promise<number> {
    const args = ns.flags([
        ["help", false]
        , ["s", ""]
        , ["m", 0]
    ]);
    if (args.help || !args.s || !args.m) {
        printHelp(ns);
        return 1;
    }
    const memory = Number.parseInt(args.m.toString());
    const transaction_cost = ns.getPurchasedServerCost(memory);

    if (memory % 2 != 0) {
        ns.tprint(`la mémoire doit être une puissance de 2`);
        return 1;
    }
    if (ns.getPurchasedServerLimit() == ns.getPurchasedServers().length) {
        ns.tprint(`vous avez atteint le maximum de server achetable : ${ns.getPurchasedServerLimit()}`);
        return 1;
    }
    if (transaction_cost > ns.getPlayer().money) {
        ns.tprint(`vous avez bersoin de ${transaction_cost}$ pour acheter une server avec ${memory} Gb de mémoire.`);
        return 1;
    }
    if (! await ns.prompt(`
   le nouveau serveur vas vous couter ${ns.formatNumber(transaction_cost)} 
   vous disposez de ${ns.getPlayer().money} $ 
   souhaitez-vous poursuivre la transaction
   `, { type: "boolean" })) {
        ns.tprint(`vous n'avez pas acheté votre nouveau serveur`);
        return 0;
    }

    const new_server = ns.purchaseServer(args.s.toString(), memory);
    new_server == "" ?
        ns.tprint(` le nouveau serveur n'a pas put être acheté`)
        : ns.tprint(` nouveau serveur acheté avec le nom ${new_server}`)
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
    return ["--help", "-s", "-m", ...data.servers]; // This script autocompletes the list of servers.
}

function printHelp(ns: NS): void {
    ns.tprint(` 
    achéte un serveur pour le joueur
    avec -s comme nom du serveur 
    et -m comme quantité de mémoire 

    `
    )
}