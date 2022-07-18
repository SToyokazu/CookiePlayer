function AutoMessage(modeName)
{
    var modeStatus = true;

    if(document.getElementById(modeName).checked ===  true){
        modeStatus = true;
    }else{
        modeStatus = false;
    }

    window.opener.postMessage({ message: modeName, status: modeStatus }, '*');
}

/*
function AutoCookieClickMessage()
{
    var modeMessage = "AutoCookieClick";
    var modeStatus = true;

    if(document.getElementById('AutoCookieClick').checked ===  true){
        modeStatus = true;
    }else{
        modeStatus = false;
    }

    window.opener.postMessage({ message: modeMessage, status: modeStatus }, '*');
}

function AutoGCClickMessage()
{
    var modeMessage = "AutoGCClick";
    var modeStatus = true;

    if(document.getElementById('AutoGCClick').checked ===  true){
        modeStatus = true;
    }else{
        modeStatus = false;
    }

    window.opener.postMessage({ message: modeMessage, status: modeStatus }, '*');
}
*/