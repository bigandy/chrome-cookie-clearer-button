// Need to do this on first opening of extension
const domains = [
    'indieweb.social',
    'facebook.com',
    'www.facebook.com',
    'bsky.app',
    'www.linkedin.com'
];

chrome.storage.sync.set({
    domains
});

const clearCache = async () => {
    const { domains }: { domains: Array<string> } = await chrome.storage.sync.get("domains");

    await chrome.browsingData.remove({
        // @ts-expect-error
        "origins": domains.map(domain => `https://${domain}`),
    }, {
        "cookies": true,
        "localStorage": true,
    });

    const perDomain = async (domain: string) => {
        await chrome.tabs.query({
            "url": [`https://*.${domain}/*`]
        }, function (tabs) {
            tabs.forEach(async tab => {

                chrome.tabs.reload(tab.id!);
            })
        })
    };

    const runAll = domains.map(async domain => await perDomain(domain))
    // @ts-expect-error
    await Promise.all[runAll];
};

// If the user clicks on the icon, clear the cache.
// Works only if there is no popup
chrome.action.onClicked.addListener(clearCache);

chrome.windows.onRemoved.addListener(() => {
    clearCache();
});

const resetBskyModalState = () => {
    sessionStorage.setItem("welcomeModalClosed", "true");
};