import BaseErrors from "./BaseError";

export default class ScriptFileException extends BaseErrors {

    constructor(...message: string[]) {
        super(...message);
        this.name = "ScriptFileException";
    }
}