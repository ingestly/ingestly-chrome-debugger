// Initialize the message listener for configuration.
chrome.runtime.onMessage.addListener(async message => {
    console.log(message);
});

