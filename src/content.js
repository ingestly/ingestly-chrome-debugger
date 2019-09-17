// Initialize the message listener for console log.
chrome.runtime.onMessage.addListener(async message => {
    console.table(message);
});
