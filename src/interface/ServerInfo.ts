import { Server } from "../../NetscriptDefinitions"

export interface ServerInfo {
    parent: string
    hostname: string
    server: Server
    child: string[]
}