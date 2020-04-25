var dislayName = 'Anonymous';
var keyName = 'master';

function chatReceived(data) {
    var msg = data.message;
    console.log(data);
    var div = '<div data-ts="' + data.timetoken + '" class="message"><b>' + msg.name + ':</b> ' + insertLinks(msg.description) + '</div>';
    $("#chatReceive").append(div);
    $('.message').click(function () {
        var ts = $(this).data('ts');

        pubnub.publish({
            channel: keyName,
            message: {
                type: 'update',
                timetoken: ts, // original message timetoken
                description: 'Removed',  // message text
                m
            },
        }, (status, response) => {
            // handle status, response
        });

    });
}

function insertLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}

function setName() {
    displayName = $('#nameText').val();
    $('#chatName').hide();
    $('#chatSend').show();
    $("#sendText")[0].focus();
    $("#sendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); sendMessage(); } });
}

function chatStatusChanged(statusEvent) {
    if (statusEvent.category === "PNConnectedCategory") {
        //publishSampleMessage();
    }
}

function chatPresenceChanged(presenceEvent) {
    console.log(presenceEvent);
}

function sendMessage() {
    //var name = 'Jeremy';
    var content = $('#sendText').val();
    var publishConfig = { channel: keyName, message: { description: content, name: displayName } };
    pubnub.publish(publishConfig, function (status, response) { console.log(status, response); });

    $('#sendText').val('');
}

function init() {
    var cssUrl = '/data/' + keyName + '/data.css';
    if (getQs('preview') == 1) cssUrl = jsonUrl.replace('data.css', 'preview.css');
    $('#customCss').attr('href', cssUrl);

    pubnub = new PubNub({
        publishKey: 'pub-c-2577d589-021d-4a43-a9d0-1edd91d28949',
        subscribeKey: 'sub-c-f873ae9e-8020-11ea-8dff-bafe0457d467',
        uuid: "myUniqueUUID"
    });
    pubnub.addListener({ status: chatStatusChanged, message: chatReceived, presence: chatPresenceChanged });
    pubnub.subscribe({ channels: [keyName] });

    /*
    var primary = getQs('primary');
    var contrast = getQs('secondary');
    var customCss = '.btn-primary { color: ' + contrast + '; background-color:' + primary + '; }\n'
        + '.btn-secondary { color: ' + primary + '; background-color:' + contrast + '; }\n'
        + '';
    $('#customCss').html(customCss);*/

    $("#nameText")[0].focus();
    $("#nameText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); setName(); } });
}

function getQs(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}