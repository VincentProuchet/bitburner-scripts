import { NS } from "../../NetscriptDefinitions";

export default class Print {
    /**@type{NS} */
    static ns: NS;

    static setNS(ns: NS) {
        Print.ns = ns;
    }

    error(message: string): void {

        Print.ns.printf(message);
    }
    info(message: string): void {
        Print.ns.printf(message);
    }

}