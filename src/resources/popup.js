let config = {}, queryCondition = {};

// Restore the configs.
chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => {
    try {
        const parser = new URL(tabs[0].url);
        chrome.storage.sync.get([parser.hostname], (result) => {
            if (result[parser.hostname]) {
                try {
                    config = JSON.parse(result[parser.hostname]);
                } catch (e) {
                    console.log(e);
                }
                for (const item in config) {
                    document.getElementById(item).value = config[item];
                }
            }
        });
        chrome.storage.sync.get(['queryCondition'], (result) => {
            try {
                queryCondition = JSON.parse(result['queryCondition']);
            } catch (e) {
                console.log(e);
            }
            for (const item in queryCondition) {
                document.getElementById(item).value = queryCondition[item];
            }
        });
    } catch (e) {
        console.log(e);
    }
});

// Action for Save button
document.getElementById('save').addEventListener('click', (event) => {
    const formFields = document.settings.getElementsByTagName('input');
    let config = {};
    for (let i = 0; i < formFields.length; i++) {
        if (formFields[i].name !== 'save' && formFields[i].name !== 'reset') {
            config[formFields[i].name] = formFields[i].value;
        }
    }
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        try {
            const parser = new URL(tabs[0].url);
            const param = {};
            param[parser.hostname] = JSON.stringify(config);
            chrome.storage.sync.set(param);
        } catch (e) {
            console.log(e);
        }
    });
    event.preventDefault();
    window.close();
}, false);

// Action for Visualize button
document.getElementById('visualize').addEventListener('click', (event) => {
    chrome.runtime.sendMessage({
        apiEndpoint: document.settings.visualizer_endpoint.value || config.visualizer_endpoint || 'http://localhost/',
        apiKey: document.settings.visualizer_key.value || config.visualizer_key || 'abc123',
        targetSelector: document.settings.visualizer_target.value || config.visualizer_target || '#article',
        date_from: document.visualizer.date_from.value || queryCondition.date_from || '2019-01-01',
        date_to: document.visualizer.date_to.value || queryCondition.date_to || '2019-12-31',
        custom_filter: document.visualizer.custom_filter.value || queryCondition.custom_filter || ''
    });
    event.preventDefault();
    window.close();
}, false);

// Save the filter condition when values are changed.
document.visualizer.addEventListener('change', (e) => {
    chrome.storage.sync.set({
        queryCondition: JSON.stringify({
            date_from: document.visualizer.date_from.value,
            date_to: document.visualizer.date_to.value,
            custom_filter: document.visualizer.custom_filter.value
        })
    });
});