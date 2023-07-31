/**
 * interface pour l'autocompletion des scripts
un objet respectant cette interface est passé à la fonction autocomplete()
de tout script appelé depuis le terminal dans le jeu

pour l'utiliser référez-vous à la fonction autocomplete d'exemple dans la documentation du jeu
ou à celle présente dans le template.ts
plus de detail ici
https://bitburner-official.readthedocs.io/en/latest/netscript/advancedfunctions/autocomplete.html 
*/
export default interface AutoCompletionValues {
    servers: string[] //list of all servers in the game.
    , txts: string[] //list of all text files on the current server.
    , scripts: string[] //list of all scripts on the current server.
    , flags: string[] //the same flags function as passed with ns. Calling this function adds all the flags as autocomplete arguments

}