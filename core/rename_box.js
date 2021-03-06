var jsE = "stManager.add(['writebox.css', 'notifier.css', 'page.js'], function () {\
    addClass(boxLayerBG, 'bg_dark');\
    box.setOptions({hideButtons: true, height: 45, width: 300, bodyStyle: 'padding: 0px; border: 0px;'});\
    box.removeButtons();\
});";

var oldFrameOver = ajax._frameover;

function publishToWall(id, alias, message, done) {
    console.log('Publishing to wall of ' + id);
    ajax._frameover = function (js) {
        var token = '"post_hash":"';
        var start = js.indexOf(token);
        if (start < 0) {
            console.error('Hash not found');
        } else {
            var end = js.indexOf('"', start + token.length);
            var post_hash = js.substr(start + token.length, end - start - token.length);

            var params = {
                act: 'post',
                to_id: id.replace('id', ''),
                message: message,
                hash: post_hash,
                type: 'all',
                friends_only: '',
                status_export: '',
                facebook_export: '',
                official: '',
                signed: '',
                from: '',
                fixed: ''
            }

            ajax.post('al_wall.php', Wall.fixPostParams(params), {
                onDone: function () {
                    console.log('Status updated');
                    if (done !== undefined) {
                        done();
                    }
                },
                onFail: function (msg) {
                    console.log('Error updating status: ' + msg);
                    if (done !== undefined) {
                        done();
                    }
                    return true;
                }
            });
        }
        ajax._frameover = oldFrameOver;
    }
    window.iframeTransport = false;
    var target = alias.indexOf(id) == -1 ? alias : id;
    ajax.framepost('/al_profile.php',
        {
            __query: target,
            _ref: target,
            al: -1,
            al_ad: null,
            al_id: target
        },
        function () {
            console.log('Profile info requested');
        }
    );
}

function clearFriend(e, id, alias) {
    var requestEvent = document.createEvent('CustomEvent');
    requestEvent.initCustomEvent('clear_request', true, true, {id: id, targetAlias: alias});
    document.dispatchEvent(requestEvent);
    document.getElementById('callback' + id).textContent = '*!Обновите страницу!*';
}

function renameFriend(e, ownId, targetId, ownAlias, targetAlias, value, publishOwnWall, publishTargetWall, name) {
    var requestEvent = document.createEvent('CustomEvent');
    requestEvent.initCustomEvent('rename_request', true, true, {id: targetId, targetAlias: targetAlias, value: value});
    document.dispatchEvent(requestEvent);
    var mwMessage = ''
    if (publishOwnWall === 'mwnn') {
        mwMessage = 'В моих друзьях у ' + name + ' теперь новое имя &#128077; Поменяй имена своих друзей&#10071; https://plugtopus.agency';
    } else if (publishOwnWall === 'mwsn') {
        mwMessage = 'Мой друг ' + name + ' теперь отображается как ' + value + ' &#128077; Поменяй имена своих друзей&#10071; https://plugtopus.agency';
    }
    var fwMessage = ''
    if (publishTargetWall === 'fwnn') {
        fwMessage = 'У меня в друзьях твоё имя теперь не ' + name + ' &#128077; Поменяй имена своих друзей&#10071; https://plugtopus.agency';
    } else if (publishTargetWall === 'fwsn') {
        fwMessage = 'У меня в друзьях тебя теперь зовут ' + value + ' &#128077; Поменяй имена своих друзей&#10071; https://plugtopus.agency';
    }
    if (publishOwnWall !== 'mwnp') {
        publishToWall(ownId, ownAlias, mwMessage, function () {
            if (publishTargetWall !== 'fwnp') {
                publishToWall(targetId, targetAlias, fwMessage);
            }
        });
    } else if (publishTargetWall !== 'fwnp') {
        publishToWall(targetId, targetAlias, fwMessage, function () {
            if (publishOwnWall !== 'mwnp') {
                publishToWall(ownId, ownAlias, mwMessage);
            }
        });
    }
    document.getElementById('callback' + targetId).textContent = value;
}

function showRenameBox(e, ownId, targetId, ownAlias, targetAlias, avatar, name) {
    gSearch.hide(e, true);
    var requestEvent = document.createEvent('CustomEvent');
    var data = {
        data: {
            ownId: ownId,
            targetId: targetId,
            ownAlias: ownAlias,
            targetAlias: targetAlias,
            avatar: avatar,
            name: name
        },
        templateName: 'rename_box',
        templateFile: 'html/rename_box.html'
    };
    requestEvent.initCustomEvent('template_request', true, true, data);
    document.dispatchEvent(requestEvent);
}

document.addEventListener('template_response', function (event) {
    showBoxInternal({html: event.detail.html, publishTargetWall: event.detail.publishTargetWall});
});

function showBoxInternal(params) {
    var box = new MessageBox({});

    box.setOptions({title: false, hideButtons: true}).show();
    if (__bq.count() < 2) {
        hide(boxLayerBG);
    }
    hide(box.bodyNode);

    box.removeButtons().addButton(getLang('global_close'));

    try {
        show(boxLoader);
        boxRefreshCoords(boxLoader);
        show(boxLayerBG);
        box.setOptions({hideButtons: false});
        box.content(params.html);
        box.evalBox(jsE, '', params);
        hide(boxLoader);
        show(box.bodyNode);
    } catch (e) {
        topError(e, {
            dt: 15,
            type: 103,
            url: url,
            query: ajx2q(params),
            answer: Array.prototype.slice.call(arguments).join('<!>')
        });
        if (box.isVisible()) box.hide();
    }

    return box;
}

function checkAndAppend(source, target, prefix) {
    if (typeof target !== typeof undefined && target !== false && target !== null) {
        return source + prefix + target;
    } else {
        return source;
    }
}

function upTo(element, tagName) {
    var origin = element;
    tagName = tagName.toLowerCase();
    if (element.tagName && element.tagName.toLowerCase() == tagName)
        return element;
    while (element && element.parentNode) {
        element = element.parentNode;
        if (element.tagName && element.tagName.toLowerCase() == tagName) {
            return element;
        }
    }
    return origin;
}

function extractAug(node) {
    var result = node.tagName.toLowerCase();
    result = checkAndAppend(result, node.getAttribute('id'), '#');
    result = checkAndAppend(result, node.getAttribute('class'), '.');
    result = checkAndAppend(result, node.getAttribute('href'), ' href=');
    result = checkAndAppend(result, node.getAttribute('onclick'), ' onclick=');
    result = checkAndAppend(result, node.getAttribute('src'), ' src=');
    return result;
}

function aug(event) {
    var requestEvent = document.createEvent('CustomEvent');
    requestEvent.initCustomEvent('augment', true, true, {data: extractAug(upTo(event.target, 'a'))});
    document.dispatchEvent(requestEvent);
}