displayName = 'Anonymous';
var keyName = 'master';
var prayerGuid = '';
var socket;
var userGuid = '';
var timerId = 0;


function keepAlive() {
    var timeout = 60 * 1000;
    if (socket.readyState == WebSocket.OPEN) socket.send('_');
    timerId = setTimeout(keepAlive, timeout);
}

function catchup(data) {
    for (var i = 0; i < data.messages.length; i++) {
        handleMessage(data.messages[i]);
    }
}

function calloutReceived(data) {
    $('#calloutText').val(data.message);
}

function prayerRequestReceived(data) {
    $('#prayerRequests').append('<div><a id=\"' + data.guid + '\" href="javascript:claimPrayer(\'' + data.guid + '\', \'' + escape(data.name) + '\');\"">' + data.name + '</a></div>');
    $('#noPrayerRequests').hide();
}

function claimPrayer(guid, name) {
    prayerGuid = guid;
    $('#noPrayerChat').hide();
    $('#prayerChat').show();
    $('#privatePrayerTitle').text('Prayer with ' + name);
    $('#prayerReceive').html('');
    socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName + prayerGuid }));
}

function chatReceived(data) {
    if (data.userGuid == userGuid) $('#msg-' + data.userGuid).remove();
    appendMessage(data.room, data.name, data.message, data.ts);
}

function appendMessage(room, name, message, ts) {
    var div = '<div id="msg-' + ts + '" class="message">';
    if (data.room == keyName) div += '<span><a href="javascript:deleteMessage(\'' + ts + '\')"><i class="far fa-trash-alt"></i></a></span>';
    div += '<b>' + name + ':</b> ' + insertLinks(message) + '</div>';

    var el = null;
    if (room == keyName) el = $("#chatReceive")
    else if (room == keyName + '.host') el = $("#hostChatReceive")
    else if (room == keyName + prayerGuid) el = $("#prayerReceive");

    if (el != null) {
        el.append(div);
        el.scrollTop(el[0].scrollHeight);
    }
}



function deleteReceived(data) {
    $('#msg-' + data.ts).remove();
}

function deleteMessage(ts) {
    socket.send(JSON.stringify({ 'action': 'deleteMessage', 'room': keyName, 'ts': ts }));
}

function setCallout() {
    var content = $('#calloutText').val();
    socket.send(JSON.stringify({ 'action': 'setCallout', 'room': keyName, 'message': content }));
    console.log('sent ' + content);
}

function insertLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}

function postMessage(room, textField) {
    var content = $('#' + textField).val();
    socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': userGuid, 'name': displayName, 'message': content }));
    appendMessage(room, displayName, content, userGuid);
    $('#' + textField).val('');
}

function sendMessage() {
    postMessage(keyName, 'sendText');
}

function sendHostMessage() {
    postMessage(keyName + '.host', 'hostSendText');
}

function sendPrivate() {
    postMessage(keyName + prayerGuid, 'sendPrivateText');
}

function handleMessage(data) {
    if (data.action == "sendMessage") chatReceived(data);
    else if (data.action == "setCallout") calloutReceived(data);
    else if (data.action == "deleteMessage") deleteReceived(data);
    else if (data.action == "requestPrayer") prayerRequestReceived(data);
    else if (data.action == "updateConfig") window.location.reload();
    else if (data.action == "catchup") catchup(data);
}


function init() {

    socket = new WebSocket('wss://i9qa0ppf43.execute-api.us-east-1.amazonaws.com/production');
    socket.onopen = function (e) {
        socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName }));
        socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName + '.host' }));
        setTimeout(keepAlive, 30 * 1000);
    };

    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        handleMessage(data);
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
        } else {
        }
    };

    socket.onerror = function (error) {
        alert(`[error] ${error.message}`);
    };


    
    var cssUrl = '/data/' + keyName + '/data.css';
    if (getQs('preview') == 1) cssUrl = jsonUrl.replace('data.css', 'preview.css');
    $('#customCss').attr('href', cssUrl);

    $("#sendText")[0].focus();
    $("#sendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); sendMessage(); } });
    $("#hostSendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); sendHostMessage(); } });
    $("#sendPrivateText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); sendPrivate(); } });
    userGuid = generateGuid();
}

function getQs(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function generateGuid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();;
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}