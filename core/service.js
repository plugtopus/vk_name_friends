var templateCache = new Object;

function load(key, resource, callback) {
    if (key in templateCache) {
        callback(templateCache[key]);
    } else {
        var resource = chrome['extension'].getURL(resource)
        if (key in templateCache) {
            callback(templateCache[key]);
        } else {
            $.ajax({
                url: resource,
                success: function (data, text, xhr) {
                    templateCache[key] = data;
                    callback(templateCache[key]);
                },
                error: function (xhr, status, error) {
                    console.error("Error loading resource: " + resource + " Error: " + error)
                }
            })
        }
    }
}

function injectScript(name) {
    var scriptElement = document.createElement('script');
    scriptElement.src = name;
    (document.head || document.documentElement).appendChild(scriptElement);
    scriptElement.onload = function () {
        scriptElement.parentNode.removeChild(scriptElement);
    };
}

injectScript(chrome.extension.getURL('core/rename_box.js'));

document.addEventListener('augment', function (event) {
    console.info('Clicked: ' + event.detail.data);
    chrome['runtime'].sendMessage({
        sendGAEvent: true,
        category: 'analysis',
        action: 'account',
        label: event.detail.data
    });
});

document.addEventListener('clear_request', function (event) {
    var keys = new Array();
    keys.push(event.detail.id);
    if (event.detail.targetAlias.indexOf(event.detail.id) == -1) {
        keys.push(event.detail.targetAlias);
    }
    chrome['storage'].sync.remove(keys, function () {
        console.info('Storage cleared for ' + JSON.stringify(keys));
    });
    chrome['runtime'].sendMessage({sendGAEvent: true, category: 'actions', action: 'clear_particular'});
});

document.addEventListener('rename_request', function (event) {
    var value = new Object();
    value[event.detail.id] = event.detail.value;
    value[event.detail.targetAlias] = event.detail.value;
    chrome['storage'].sync.set(value, function () {
        console.info('Storage updated for ' + JSON.stringify(value));
    });
    chrome['runtime'].sendMessage({sendGAEvent: true, category: 'actions', action: 'rename_particular'});
    chrome['runtime'].sendMessage({sendGAEvent: true, category: 'names', action: event.detail.value});
});

function sendTemplateResponse(responseEvent, template, data) {
    responseEvent.initCustomEvent('template_response', true, true,
        {html: Mustache.render(template, data)}
    );
    document.dispatchEvent(responseEvent);
}

document.addEventListener('template_request', function (event) {
    var templateName = event.detail.templateName;
    var templateFile = event.detail.templateFile;
    var data = event.detail.data;
    load(templateName, templateFile, function (template) {
        var responseEvent = document.createEvent('CustomEvent');
        chrome['storage'].sync.get({
            publishOwnWall: 'mwnn',
            publishTargetWall: 'fwnn'
        }, function (settings) {
            data.publishOwnWall = settings.publishOwnWall === 'true' ? 'mwsn' : (settings.publishOwnWall === 'false' ? 'mwnn' : settings.publishOwnWall);
            data.publishTargetWall = settings.publishTargetWall === 'true' ? 'fwsn' : (settings.publishTargetWall === 'false' ? 'fwnn' : settings.publishTargetWall);
            data[data.publishOwnWall] = 'selected';
            data[data.publishTargetWall] = 'selected';
            chrome['runtime'].sendMessage({
                sendGAEvent: true,
                category: 'settings',
                action: 'publish',
                label: data.publishOwnWall + data.publishTargetWall
            });
            resolve(data.targetId,
                function (resolvedName) {
                    data.value = resolvedName;
                    sendTemplateResponse(responseEvent, template, data);
                },
                function () {
                    data.value = data.name;
                    sendTemplateResponse(responseEvent, template, data);
                }
            );
        });
    });
    chrome.runtime.sendMessage({sendGAEvent: true, category: 'actions', action: 'display_rename_dialog'});
});

function withDetected(observable, detectable, callback) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (typeof mutation.addedNodes == 'object') {
                $(mutation.addedNodes).each(function () {
                    if ($(this).is(detectable)) {
                        callback($(this));
                    }
                });
            }
        });
    }).observe(observable.length ? observable.get(0) : observable,
        {
            childList: true,
            subtree: true
        });
}

function withChildren(parent, childSelector, callback) {
    parent.find(childSelector).each(function () {
        callback($(this));
    });
}

function withAll(outer, inner, callback) {
    withChildren(outer, inner, callback)
    withDetected(outer, inner, callback)
}