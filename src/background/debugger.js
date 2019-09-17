// Read mapping.json for building the table in console.
const getMapping = async () => {
    const response = await fetch(chrome.runtime.getURL("resources/mapping.json"), {method: "GET"});
    const body = await response.text();
    mapping = JSON.parse(body);
};

// Format the debugger result.
const formatResult = (url) => {
    const parser = new URL(url);
    let result = {};
    result = {
        Protocol: {Column: '__n/a__', Value: parser.protocol},
        Endpoint: {Column: '__n/a__', Value: parser.hostname}
    };
    for (const param of parser.searchParams) {
        result[param[0]] = {
            Column: mapping[param[0]],
            Value: param[1]
        };
    }
    return result;
};

// The observer for the debugger.
const observeNetwork = () => {
    return chrome.webRequest.onBeforeRequest.addListener(
        (item) => {
            if (item.url.match(/\/ingestly-ingest\/.*|\/ingestly-sync\/.*/)) {
                try {
                    chrome.tabs.sendMessage(
                        item.tabId,
                        formatResult(item.url)
                    );
                } catch (e) {
                    console.log(e);
                }
            }
        },
        {urls: ['<all_urls>']},
        []
    );
};

// Start observing requests.
getMapping().then(() => {
    observeNetwork();
});