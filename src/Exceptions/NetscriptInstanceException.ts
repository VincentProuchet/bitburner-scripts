import BaseErrors from "./BaseError";
/**
 * error à emettre lors d'un défaut d'instance de netscript
* 
 */
export default class NetscriptInstanceException extends BaseErrors {


    constructor(...message: string[]) {
        super(...message);
        this.name = "NetscriptInstanceException";
    }


}