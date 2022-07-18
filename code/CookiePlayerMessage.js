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