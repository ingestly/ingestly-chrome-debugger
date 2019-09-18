// Define variations of report modules.
const reportModules = [
    'summary',
    'timeseries',
    'read-through',
    'scroll-depth'
];

// Build the base URL for API requests.
const buildBaseUrl = (params) => {
    return `${params.apiEndpoint}/api`
        + `?api_key=${encodeURIComponent(params.apiKey)}`
        + `&date_from=${encodeURIComponent(params.date_from)}`
        + `&date_to=${encodeURIComponent(params.date_to)}`
        + `&custom_filter=${encodeURIComponent(params.custom_filter)}`
        + `&module=`;
};

// Pass the API response to content script.
const supplyData = (module, data) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        try {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    type: 'visualizer',
                    body: {
                        module: module,
                        data: data
                    }
                }
            );
        } catch (e) {
            console.log(e);
        }
    });
};

// Initialize the message listener for configuration.
chrome.runtime.onMessage.addListener(async (params) => {
    const baseUrl = buildBaseUrl(params);
    for (let i = 0; i < reportModules.length; i++) {
        //fetch(baseUrl + reportModules[i]);
        supplyData(reportModules[i], {url: baseUrl + reportModules[i]});
    }
});

