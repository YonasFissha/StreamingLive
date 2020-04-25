var displayName = 'Anonymous';
var keyName = 'master';
var prayerGuid = '';
var socket;


var timerID = 0;


function keepAlive() {
    var timeout = 60 * 1000;
    console.log(socket.readyState);
    if (socket.readyState == WebSocket.OPEN) socket.send('_');
    timerId = setTimeout(keepAlive, timeout);
}

function catchup(data) {
    for (var i = 0; i < data.messages.length; i++) {
        handleMessage(data.messages[i]);
    }
}

function chatReceived(data) {
    var div = '<div id="msg-' + data.ts + '" class="message">';
    div += '<b>' + data.name + ':</b> ' + insertLinks(data.message) + '</div>';

    if (data.room == keyName) {
        $("#chatReceive").append(div);
        $("#chatReceive").scrollTop($("#chatReceive")[0].scrollHeight);
    }
    else if (data.room == prayerGuid) {
        $("#prayerReceive").append(div);
        $("#prayerReceive").scrollTop($("#prayerReceive")[0].scrollHeight);
    }
}


function calloutReceived(data) {
    console.log(data);
    if (data.message == '') $('#callout').hide();
    else {
        $('#callout').html(insertLinks(data.message));
        $('#callout').show();
    }
}


function deleteReceived(data) {
    $('#msg-' + data.ts).remove();
}


function insertLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}

function setName(mode) {
    if (mode == 'prayer') displayName = $('#prayerNameText').val();
    else displayName = $('#nameText').val();


    $('#chatName').hide();
    $('#chatSend').show();

    $('#prayerName').hide();
    $('#prayerSend').show();

    $("#sendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); sendMessage(); } });
    //$("#prayerSendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); prayerSendMessage(); } });

    if (mode == 'prayer') $("#prayerSendText")[0].focus();
    else $("#sendText")[0].focus();
}


function sendMessage() {
    var content = $('#sendText').val();
    if (content.trim() == '') return;
    socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': keyName, 'name': displayName, 'message': content }));

    $('#sendText').val('');
}

function prayerSendMessage() {
    var content = $('#prayerSendText').val();
    if (content.trim() == '') return;
    socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': prayerGuid, 'name': displayName, 'message': content }));
    $('#prayerSendText').val('');
}



function requestPrayer() {
    prayerGuid = generateGuid();
    socket.send(JSON.stringify({ 'action': 'requestPrayer', 'room': keyName, 'name': displayName, 'guid': prayerGuid }));
    socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': prayerGuid }));
    $("#prayerSendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); prayerSendMessage(); } });
    $("#prayerSendText")[0].focus();
    togglePrayer();
}

function togglePrayer() {
    $('#prayerSendInput').hide();
    $('#requestPrayer').hide()

    if (prayerGuid != '') $('#prayerSendInput').show();
    else $('#requestPrayer').show();
}

function generateGuid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();;
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function handleMessage(data) {
    if (data.action == "sendMessage") chatReceived(data);
    else if (data.action == "setCallout") calloutReceived(data);
    else if (data.action == "deleteMessage") deleteReceived(data);
    else if (data.action == "updateConfig") window.location.reload();
    else if (data.action == "catchup") catchup(data);
}

function initChat() {
    socket = new WebSocket('wss://i9qa0ppf43.execute-api.us-east-1.amazonaws.com/production');
    socket.onopen = function (e) {
        socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName }));
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
        alert('[error] ${error.message}');
    };

    $("#nameText")[0].focus();
    $("#nameText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); setName(); } });

    if ($('#prayerContainer').length>0) togglePrayer();
}




function getChatDiv() {
    var result = '<div id="chatContainer">';

    result += '<div id="chatReceive"><div id="callout"></div></div>';

    result += '<div id="chatSend" style="display:none;">'
        + ' <div class="input-group" id="sendPublic"><input type="text" class="form-control" id="sendText" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:sendMessage();">Send</a></div></div>'
        + '</div>';

    result += '<div id="chatName">'
        + ' <div class="form-group">'
        + '     <label>Enter your name to chat:</label>'
        + '     <div class="input-group"><input type="text" class="form-control" id="nameText" placeholder="Your Name" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:setName(\'chat\');">Begin</a></div></div>'
        + ' </div>'
        + '</div>';

    result += '</div>';
    return result;
}

function getPrayerDiv() {
    var result = '<div id="prayerContainer">';
    result += '<div id="prayerReceive"><p><i>You are in private prayer mode.  Messages posted here are only visible to you and the host responding to your prayer request.</i></p></div>';

    result += '<div id="prayerSend" style="display:none;">'
        + ' <div class="input-group" id="prayerSendInput" style="display:none;"><input type="text" class="form-control" id="prayerSendText" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:prayerSendMessage();">Send</a></div></div>'
        + '<div id="requestPrayer" style="display:none;"><a class="btn btn-primary btn-block" style="border-radius:0px" href="javascript:requestPrayer();">Request Prayer</a></div>'
        + '</div>';

    result += '<div id="prayerName">'
        + ' <div class="form-group">'
        + '     <label>Enter your name to chat:</label>'
        + '     <div class="input-group"><input type="text" class="form-control" id="prayerNameText" placeholder="Your Name" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:setName(\'prayer\');">Begin</a></div></div>'
        + ' </div>'
        + '</div>';

    result += '</div>';

    return result;
}