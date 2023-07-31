import { NS } from "../../NetscriptDefinitions";
import NetscriptInstanceException from "/Exceptions/NetscriptInstanceException";
import { MessageDestination } from "/enums/MessageDestination";
import { MessageType } from "/enums/MessageType";



/**
 * classe de messagerie
centralise les appels d'affichage
pour le moment celà n'affiche que
dans les logs
dans le terminal
 */
export default class Message {
    static classeName = "Message";
    static ns: NS | undefined;
    /**
     * 
     * @param ns instance de NS
     */
    constructor(ns: NS) {
        if (Message.ns == null) {
            Message.ns = ns;
        }
    }
    /**
     * 
     * @param message
     * @param type
     * @param destination ou serat affiché le message
                    par défaut les logs du script
     * @returns {void}
     */
    message(message: string, type: MessageType = MessageType.null, destination: MessageDestination = MessageDestination.log): void {
        if (Message.ns == undefined) {
            throw new NetscriptInstanceException(` la classe ${Message.classeName} n'a pas d'instance de netscript`);
            return;
        }
        switch (destination) {
            case MessageDestination.terminal:
                Message.ns.tprint(type + " " + message);
                break;
            case MessageDestination.log:
                Message.ns.print(type + " " + message);
                break;
            default:
                Message.ns.print(message);
                break;
        }
    }
}