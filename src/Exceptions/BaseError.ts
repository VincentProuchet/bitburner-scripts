/**
 * classe de base pour les erreurs du script
    notez que le constructeur prend un
    ou plusieurs paramètre qui doivent tous pouvoir se convertir 
    en chaine de caractére
 */
export default class BaseErrors extends Error {

    constructor(...message: string[]) {
        super(BaseErrors.assembleMessage(message));
    }
    /**
     * assemble le message à partir du tableau 
    * elle n'existe que parce que l'appel au super()
    doit obligatoirement en première ligne du constructeur
     * @param message 
     * @returns 
     */
    private static assembleMessage(message: string[]): string {
        let response = "";
        for (const line in message) {
            response += line;
        }
        return response
    }




}