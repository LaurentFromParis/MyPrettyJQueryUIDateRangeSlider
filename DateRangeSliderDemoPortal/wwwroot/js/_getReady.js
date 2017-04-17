$(document).ready(function () {
    ///<summary>Verify if view docReady function is available</summary>
    if (typeof DocReady === "function") {
        GetReady();
    }

    var GetReady = function () {
        /// <summary>
        /// Lancée dès la fin du charement de la page, attend que le fichier de données dynamique soit chargé pour appeller getReady
        /// </summary>
        if (scriptGLoaded != undefined) {
            if (waitForScriptGTimer != null) {
                clearInterval(waitForScriptGTimer);
            }
            DocReady();
        } else {
            waitForScriptGTimer = setInterval(GetReady, 500);
        }
    }
});