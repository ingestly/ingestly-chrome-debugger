// Initialize the message listener for console log.
chrome.runtime.onMessage.addListener(async message => {
    if(message.type === 'debugger'){
        console.table(message.body);
    }else{
        console.log(message.body);
    }

});
