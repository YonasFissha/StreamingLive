var displayName = 'Anonymous';
var keyName = 'master';
var prayerGuid = '';
var socket;
var userGuid = '';
var timerId = 0;


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
    if (data.userGuid == userGuid) $('#msg-' + data.userGuid).remove();
    appendMessage(data.room, data.name, data.message, data.ts);
}

function appendMessage(room, name, message, ts) {
    var div = '<div id="msg-' + ts + '" class="message">';
    div += '<b>' + name + ':</b> ' + insertLinks(message) + '</div>';
    if (room == keyName) {
        $("#chatReceive").append(div);
        $("#chatReceive").scrollTop($("#chatReceive")[0].scrollHeight);
    }
    else if (room == keyName + prayerGuid) {
        $("#prayerReceive").append(div);
        $("#prayerReceive").scrollTop($("#prayerReceive")[0].scrollHeight);
    }
}


function calloutReceived(data) {
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
    if (!chatEnabled) return;
    var name = '';
    if (mode == 'prayer') name = $('#prayerNameText').val();
    else name = $('#nameText').val();
    if (name == '') return;
    if (confirm('Please confirm.  Would you like to set your name to ' + name + '?'))
    {
        displayName = name;
        userGuid = generateGuid();

        $('#chatName').hide();
        $('#chatSend').show();

        $('#prayerName').hide();
        $('#prayerSend').show();

        $("#sendText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); sendMessage(); } });

        initEmoji();

        if (mode == 'prayer') $("#prayerSendText")[0].focus();
        else $("#sendText")[0].focus();
    }
}

function postMessage(room, textField) {
    if (!chatEnabled) return;
    var content = $('#' + textField).val();
    if (content.trim() == '') return;
    socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': userGuid, 'name': displayName, 'message': content }));
    appendMessage(room, displayName, content, userGuid);
    $('#' + textField).val('');
}

function sendMessage() {
    postMessage(keyName, 'sendText');
}

function prayerSendMessage() {
    postMessage(keyName + prayerGuid, 'prayerSendText');
}



function requestPrayer() {
    if (!chatEnabled) return;
    prayerGuid = generateGuid();
    socket.send(JSON.stringify({ 'action': 'requestPrayer', 'room': keyName, 'name': displayName, 'guid': prayerGuid }));
    socket.send(JSON.stringify({ 'action': 'joinRoom', 'room': keyName + prayerGuid }));
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
    else if (data.action == "updateConfig") updateConfig();
    else if (data.action == "catchup") catchup(data);
}

function updateConfig() {
    loadConfig();
}


function initChat() {
    socket = new WebSocket('wss://lr6pbsl0ji.execute-api.us-east-2.amazonaws.com/production');
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

    result += '<div id="callout"></div><div id="chatReceive"></div>';

    result += '<div id="chatSend" style="display:none;">'
        + ' <div class="input-group" id="sendPublic"><div class="input-group-prepend"><a href="javascript:void();" data-field="sendText" class="btn btn-outline-secondary emojiButton">😀</a></div><input type="text" class="form-control" id="sendText" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:sendMessage();">Send</a></div></div>'
        + '</div>';

    result += '<div id="chatName">'
        + ' <div class="form-group">'
        + '     <label>Enter your name to chat:</label>'
        + '     <div class="input-group"><input type="text" class="form-control" id="nameText" placeholder="Your Name" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:setName(\'chat\');">Set Name</a></div></div>'
        + ' </div>'
        + '</div>';

    result += '</div>';
    return result;
}

function getPrayerDiv() {
    var result = '<div id="prayerContainer">';
    result += '<div id="prayerReceive"><p><i>You are in private prayer mode.  Messages posted here are only visible to you and the host responding to your prayer request.</i></p></div>';

    result += '<div id="prayerSend" style="display:none;">'
        + ' <div class="input-group" id="prayerSendInput" style="display:none;"><div class="input-group-prepend"><a href="javascript:void();" data-field="prayerSendText" class="btn btn-outline-secondary emojiButton">😀</a></div><input type="text" class="form-control" id="prayerSendText" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:prayerSendMessage();">Send</a></div></div>'
        + '<div id="requestPrayer" style="display:none;"><a class="btn btn-primary btn-block" style="border-radius:0px" href="javascript:requestPrayer();">Request Prayer</a></div>'
        + '</div>';

    result += '<div id="prayerName">'
        + ' <div class="form-group">'
        + '     <label>Enter your name to chat:</label>'
        + '     <div class="input-group"><input type="text" class="form-control" id="prayerNameText" placeholder="Your Name" /><div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:setName(\'prayer\');">Set Name</a></div></div>'
        + ' </div>'
        + '</div>';

    result += '</div>';

    return result;
}


function initEmoji(el) {
    $('.emojiButton').each(function () {
        $(this).popover({
            html: true,
            content: getEmojiHtml($(this).data('field'))
        });
    }).on('shown.bs.popover', function () {
        var emojiField = $('#' + $(this).data('field'));
        $('.emojiContent a').click(function (e) {
            e.preventDefault();
            var el = $(e.currentTarget);
            emojiField.val(emojiField.val() + el.html());
            $('.emojiButton').popover('hide');
        })
    });
}

function getEmojiHtml(field) {
    var emojis = ['😀', '😁', '🤣', '😉', '😊', '😇', '😍', '😜', '🤫', '🤨', '🙄', '😬', '😔', '😷', '🤯', '😎', '😲', '❤', '👋', '✋', '🤞', '👍', '👊', '👏', '🙌', '🙏'];
    var result = '<div class="row emojiContent">';
    for (i = 0; i < emojis.length; i++) result += '<div class="col-3"><a href="#" data-field="' + field + '">' + emojis[i] + '</a></div>';
    result += '</div>';
    return result;
}
