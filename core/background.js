chrome['runtime'].sendMessage({
    sendGAEvent: true,
    category: 'users',
    action: 'ping'
});

console.info('Adding on-install event listener');
chrome['runtime']['onInstalled'].addListener(function(details) {
    console.info('Refreshing matching windows');
    chrome['tabs'].query({
        url: '*://vk.com/*'
    }, function(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome['tabs'].reload(tabs[i].id);
        }
    });
});