document.getElementById('clear').addEventListener('click', clearStorage);
document.addEventListener('DOMContentLoaded', restore);

function clearStorage() {
    console.info('Clearing storage');
    chrome['storage']['sync']['get']({
        publishOwnWall: true,
        publishTargetWall: true
    }, function (settings) {
        chrome['storage']['sync'].clear(function () {
            console.info('Storage cleared');
        });
        chrome['storage']['sync'].set({
            publishOwnWall: settings.publishOwnWall,
            publishTargetWall: settings.publishTargetWall
        }, function () {
            var status = document.getElementById('status');
            status.textContent = 'Все имена сброшены';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    });
    chrome['runtime'].sendMessage({sendGAEvent: true, category: 'actions', action: 'clear_storage'});
}

function restore() {
    document.getElementById("my_wall_publishing").addEventListener('change', save);
    document.getElementById("friend_wall_publishing").addEventListener('change', save);
    console.log('Loading html');
    chrome['storage']['sync']['get']({
        publishOwnWall: 'mwnn',
        publishTargetWall: 'fwnn'
    }, function (settings) {
        document.getElementById('my_wall_publishing').value = settings.publishOwnWall === 'true' ? 'mwsn' : (settings.publishOwnWall === 'false' ? 'mwnn' : settings.publishOwnWall);
        document.getElementById('friend_wall_publishing').value = settings.publishTargetWall === 'true' ? 'fwsn' : (settings.publishTargetWall === 'false' ? 'fwnn' : settings.publishTargetWall);
    });
    chrome['runtime'].sendMessage({sendGAEvent: true, category: 'actions', action: 'restore_options'});
}

function save() {
    console.log('Saving html');
    chrome['storage']['sync'].set({
        publishOwnWall: document.getElementById('my_wall_publishing').value,
        publishTargetWall: document.getElementById('friend_wall_publishing').value
    }, function () {
        console.log('Options saved');
    });
    chrome['runtime'].sendMessage({sendGAEvent: true, category: 'actions', action: 'save_options'});
}