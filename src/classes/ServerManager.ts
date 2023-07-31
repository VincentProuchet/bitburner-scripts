import { NS } from "../../NetscriptDefinitions";
import Message from "./Messages";
import { MessageType } from "/enums/MessageType";
import { ServerInfo } from "/interface/ServerInfo";

/**
 *  cette classe est capable d'effectuer un scan complet 
du réseau
et de contenir la liste complete de tous les serveur trouvé 
et leur informations associées
 */
export default class ServerManager {

    static server: ServerInfo[] = [];
    static messenger: Message;
    static ns: NS

    private recursiveScan(parent: string, server: string): void {
        const childs = ServerManager.ns.scan(server);
        for (const child of childs) {
            if (parent == child) {
                // si le parent et l'enfant sont identiques
                // on zappe sa boucle
                continue
            }
            ServerManager.server.unshift(
                {
                    parent: parent
                    , hostname: child
                    , server: ServerManager.ns.getServer(child)
                    , child: ServerManager.ns.scan(child)
                }
            )
            this.recursiveScan(server, child);


        }

    }


    constructor(netscript: NS) {
        ServerManager.ns = netscript;
        ServerManager.messenger = new Message(netscript);
        this.recursiveScan("", 'home');
    }
    public diplsayList(): void {

        if (ServerManager.ns == undefined || ServerManager.messenger == undefined) {
            return;
        }
        for (const line of ServerManager.server) {
            ServerManager.ns.tprint(MessageType.info + " serveur " + line.hostname);
            ServerManager.ns.tprint("parent : " + line.parent);
            ServerManager.ns.tprint(" hack difficulty " + line.server.hackDifficulty);
            ServerManager.ns.tprint(line.child);
        }
    }


}

