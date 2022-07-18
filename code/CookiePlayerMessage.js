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