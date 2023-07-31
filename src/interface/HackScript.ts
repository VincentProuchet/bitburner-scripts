/**
 * garde les données de lancement d'un script
 */
export default interface HackScript {
    /** PID du script */
    pid: number;
    /** serveur d'ou est executé le script */
    source: string;
}