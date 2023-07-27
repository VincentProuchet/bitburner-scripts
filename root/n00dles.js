/** @param {NS} ns */
export async function main(ns) {

  var hostname = ns.getHostname();
  // keep the script alive
  var doLoop = true;
  // doing hack or not
  var doHack = true;

  var doWeaken = true;
  // max security I authorize server to raise to
  var maxSecurityLevel = 1.5;
  // current security level before the weaken call
  // used to secure that the weaken works properly
  var securityLevel = await ns.getServerSecurityLevel(hostname);
  // level of security the server was as the start of the script
  var originalSecurityLevel = securityLevel;
  // level of money avail at the start of the script
  var originalServerMoney = await ns.getServerMoneyAvailable(hostname);
  var minAcceptedMoney = 1000 // $
  var hackResult = 0;
  var growResult = 0;

  do {

    hackResult = await ns.hack(hostname)
    // if 0 then i may be because of a to high security level
    if (hackResult == 0) {
      securityLevel = await ns.getServerSecurityLevel(hostname)
      if (securityLevel > maxSecurityLevel) {
        do {

          let newSecurityLevel = await ns.weaken(hostname);
          // i check if weaken worked properly
          if (securityLevel > newSecurityLevel) {
            securityLevel = newSecurityLevel;
          }
          else {
            doWeaken = false;
          }
        } while (doWeaken);
      }


    }
    // if money earned is inferior to a treshold
    if (hackResult < minAcceptedMoney) {
      // we grow money on the server
      growResult = await ns.grow(hostname);
    };

  } while (doLoop);
}

