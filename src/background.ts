const domains = [
    'indieweb.social',
    'facebook.com',
    'www.facebook.com',
    'bsky.app',
    'www.linkedin.com'
];

chrome.storage.sync.set({
    domains
})


const clearCache = async () => {
    const { domains } = await chrome.storage.sync.get("domains");

    console.log({ domains })

    console.log('clicked icon');
    // const { statusCode } = await chrome.runtime.sendMessage({
    //     url: 'https://example.com'
    // });

    // console.log({ statusCode })

    const perDomain = async (domain: string) => {
        const message = await deleteDomainCookies(domain);

        // const cookies = await chrome.cookies.getAll({ domain });

        console.log({ message })



        await chrome.tabs.query({
            "url": [`https://*.${domain}/*`]
        }, function (tabs) {
            // const urls = tabs?.map(tab => tab.url)
            console.log({ tabs })

            tabs.forEach(async tab => {
                const { statusCode } = await chrome.tabs.sendMessage(tab.id!, { type: "DELETE_LOCALSTORAGE", domain });
                console.log({ statusCode })
            })
        })
    };

    // @ts-expect-error
    const runAll = domains.map(async domain => await perDomain(domain))
    // @ts-expect-error
    await Promise.all[runAll];
};




chrome.action.onClicked.addListener(clearCache);
// chrome.runtime.onMessage.addListener((request) => {
//     if (request.type === 'CLEAR_CACHE') {
//         console.log('clear cache please');
//         clearCache();
//     }
// });






async function deleteDomainCookies(domain: string) {
    let cookiesDeleted = 0;
    try {
        const cookies = await chrome.cookies.getAll({ domain });

        if (cookies.length === 0) {
            return 'No cookies found';
        }

        let pending = cookies.map(deleteCookie);
        await Promise.all(pending);

        cookiesDeleted = pending.length;
    } catch (error) {
        // @ts-expect-error
        return `Unexpected error: ${error.message}`;
    }

    return `Deleted ${cookiesDeleted} cookie(s).`;
}

// @ts-expect-error
function deleteCookie(cookie) {
    // Cookie deletion is largely modeled off of how deleting cookies works when using HTTP headers.
    // Specific flags on the cookie object like `secure` or `hostOnly` are not exposed for deletion
    // purposes. Instead, cookies are deleted by URL, name, and storeId. Unlike HTTP headers, though,
    // we don't have to delete cookies by setting Max-Age=0; we have a method for that ;)
    //
    // To remove cookies set with a Secure attribute, we must provide the correct protocol in the
    // details object's `url` property.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Secure
    const protocol = cookie.secure ? 'https:' : 'http:';

    // Note that the final URL may not be valid. The domain value for a standard cookie is prefixed
    // with a period (invalid) while cookies that are set to `cookie.hostOnly == true` do not have
    // this prefix (valid).
    // https://developer.chrome.com/docs/extensions/reference/cookies/#type-Cookie
    const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

    return chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId
    });
}
