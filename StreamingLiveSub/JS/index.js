//chat
var displayName = 'Anonymous';
var keyName = 'master';
var prayerGuid = '';
var socket;
var userGuid = '';
var timerId = 0;

//player
var videoUrl = 'about:blank';
var keyName = 'master';
var currentService = null;
var data = null;
var oldData = null;
var chatEnabled = true;
var checkServiceTimer = null;

function init() {
    loadConfig();
}

function checkService() {
    if (data.services.length > 0)
    {
        currentService = determineCurrentService();
        var currentTime = new Date().getTime();
        if (currentService != null && currentTime<currentService.localEndTime)
        {
            if (currentTime <= currentService.localStartTime) displayTimeRemaining(currentTime);
            else showVideo();
        } else showNoService();
    } else showNoService();
    toggleChatEnabled();
}

function toggleChatEnabled() {
    var currentTime = new Date().getTime();
    var result = (currentService == null) ? false : currentTime >= currentService.localChatStart && currentTime <= currentService.localChatEnd;

    if (result != chatEnabled) {
        if (result) {
            $('#chatContainer, #prayerContainer').removeClass('chatDisabled');
        } else {
            $('#chatContainer, #prayerContainer').addClass('chatDisabled');
        }
    }
    chatEnabled = result;
}

function showNoService() {
    $('#noVideoContent').html('<h2>Check Back for New Services</h2>');
    hideVideo();
}

function showVideo() {
    $('#videoFrame').show()
    $('#noVideoContent').hide();

    if ($('#videoFrame').attr('src').indexOf(currentService.videoUrl) == -1)
    {
        $('#videoFrame').attr('src', currentService.videoUrl);
        var seconds = Math.floor((new Date().getTime() - currentService.localStartTime) / 1000);
        if (seconds > 10) {
            if (currentService.provider == "youtube_watchparty") $('#videoFrame').attr('src', currentService.videoUrl + '&start=' + seconds.toString());
            if (currentService.provider == "vimeo_watchparty") $('#videoFrame').attr('src', currentService.videoUrl + '#t=' + seconds.toString() + "s");
        } else {
            if (currentService.provider == "youtube_watchparty") $('#videoFrame').attr('src', currentService.videoUrl + '&start=0');
            if (currentService.provider == "vimeo_watchparty") $('#videoFrame').attr('src', currentService.videoUrl + '#t=0m0s');
        }
    }
}

function hideVideo() {
    if ($('#videoFrame').is(':visible')) {
        $('#videoFrame').hide()
        //$('#noVideoContent').css('display', 'table');
        $('#noVideoContent').show();
    }
    if ($('#videoFrame').attr('src') != 'about:blank') $('#videoFrame').attr('src', 'about:blank');
}

function displayTimeRemaining(currentTime) {
    hideVideo();
    var remainingSeconds = Math.floor((currentService.localCountdownTime.getTime() - currentTime) / 1000);
    if (remainingSeconds > 86400) {
        var d = currentService.localCountdownTime;
        var formattedDate = d.toDateString() + ' - ' + d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 


        $('#noVideoContent').html('<h2>Next Service Time</h2>' + formattedDate );
    } else {

        var hours = Math.floor(remainingSeconds / 3600);
        remainingSeconds = remainingSeconds - (hours * 3600);
        var minutes = Math.floor(remainingSeconds / 60);
        seconds = remainingSeconds - (minutes * 60);
        var displayTime = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2);
        $('#noVideoContent').html('<h2>Next Service Time</h2>' + displayTime);
    }

    hideVideo();

}



function loadConfig() {
    var jsonUrl = '/data/' + keyName + '/data.json?nocache=' + (new Date()).getTime();
    if (getQs('preview') == 1) jsonUrl = '/preview/data.json?key=' + keyName + '&nocache=' + (new Date()).getTime();

    $.getJSON(jsonUrl, function (_data) {
        data = _data;
        updateServiceTimes();
        if (checkServiceTimer==null) checkServiceTimer = setInterval(checkService, 1000);
        var buttonHtml = '';
        for (i = 0; i < data.buttons.length; i++) {
            buttonHtml += '<td><a href="' + data.buttons[i].url + '" target="_blank" class="btn btn-secondary">' + data.buttons[i].text + '</a></td>';
        }
        $('#liveButtons').html('<div><table><tr>' + buttonHtml + '</tr></table></div>');
        $('#logo').html('<a href="' + data.logo.url + '" target="_blank"><img src="' + data.logo.image + '" /></a>')

        if (oldData == null || oldData.tabs !== data.tabs) {
            var interactHtml = '';
            var altTabs = '';
            for (i = 0; i < data.tabs.length; i++) {
                var tab = data.tabs[i];
                interactHtml += '<a id="tab' + i.toString() + '" href="#" onclick="return toggleTab(' + i.toString() + ')" class="tab"><i class="' + tab.icon + '"></i>' + tab.text + '</a>';
                interactHtml += '<div id="frame' + i.toString() + '"  class="frame">';
                if (tab.type == 'chat') interactHtml += getChatDiv();
                else if (tab.type == 'prayer') interactHtml += getPrayerDiv();
                else interactHtml += '<iframe src="' + tab.url + '" frameborder="0"></iframe>';
                interactHtml += '</div>'
                altTabs += '<td><a id="altTab' + i.toString() + '" href="#" onclick="return toggleTab(' + i.toString() + ')" class="altTab"><i class="' + tab.icon + '"></i></a></td>';
            }
            $('#interactionContainer').html('<table id="altTabs"><tr>' + altTabs + '</tr></table>' + interactHtml);
            toggleTab(0);
        }

        var cssUrl = '/data/' + keyName + '/data.css?nocache=' + new Date().getTime();
        if (getQs('preview') == 1) cssUrl = '/preview/data.css?key=' + keyName + '&nocache=' + new Date().getTime();
        $('#customCss').attr('href', cssUrl);

        initChat();

        oldData = data;
    });
}






function updateServiceTimes() {
    if (data.services != null) {
        for (i = 0; i < data.services.length; i++) {
            var s = data.services[i];

            s.localCountdownTime = new Date(new Date(s.serviceTime + 'Z').getTime());

            s.localStartTime = new Date(s.localCountdownTime.getTime());
            s.localStartTime.setSeconds(s.localStartTime.getSeconds() - getSeconds(s.earlyStart));

            s.localEndTime = new Date(s.localStartTime.getTime());
            s.localEndTime.setSeconds(s.localEndTime.getSeconds() + getSeconds(s.duration));

            s.localChatStart = new Date(s.localStartTime.getTime());
            s.localChatStart.setSeconds(s.localChatStart.getSeconds() - getSeconds(s.chatBefore));

            s.localChatEnd = new Date(s.localEndTime.getTime());
            s.localChatEnd.setSeconds(s.localChatEnd.getSeconds() + getSeconds(s.chatAfter));
        }
    }

}

function getSeconds(displayTime) {
    try {
        var parts = displayTime.split(':');
        var seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        return seconds;
    } catch (ex) {
        return 0;
    }
}



function toggleTab(idx) {
    
    $('#altTabs a').removeClass('active');
    $('#altTab' + idx.toString()).addClass('active');

    $('.frame').hide();
    $('#frame' + idx.toString()).show();

    return false;
}

function getQs(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}



function determineCurrentService() {
    var result = null;
    var currentTime = new Date();
    for (i = 0; i < data.services.length; i++) {
        var s = data.services[i];
        if (currentTime <= s.localChatEnd) {
            if (result == null || s.localEndTime < result.localEndTime) result = s;
        }
    }
    return result;
}




//****************chat**************
function keepAlive() {
    var timeout = 60 * 1000;
    console.log(socket.readyState);
    if (socket.readyState == WebSocket.OPEN) socket.send('{"action":"keepAlive", "room":""}');
    timerId = setTimeout(keepAlive, timeout);
}

function catchup(data) {
    for (var i = 0; i < data.messages.length; i++) {
        handleMessage(data.messages[i]);
    }
}

function chatReceived(data) {
    if (data.userGuid == userGuid) $('#msg-' + data.userGuid).remove();
    appendMessage(data.room, data.name, data.msg, data.ts);
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
    if (data.msg == '') $('#callout').hide();
    else {
        $('#callout').html(insertLinks(data.msg));
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
    if (confirm('Please confirm.  Would you like to set your name to ' + name + '?')) {
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
    socket.send(JSON.stringify({ 'action': 'sendMessage', 'room': room, 'userGuid': userGuid, 'name': displayName, 'msg': content }));
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
        //alert('[error] ${error.message}');
    };

    $("#nameText")[0].focus();
    $("#nameText").keypress(function (e) { if (e.which == 13) { e.preventDefault(); setName(); } });

    if ($('#prayerContainer').length > 0) togglePrayer();
}


function getChatDiv() {
    var result = '<div id="chatContainer">';

    result += '<div id="callout"></div><div id="chatReceive"></div>';

    result += '<div id="chatSend" style="display:none;">'
        + ' <div class="input-group" id="sendPublic"><div class="input-group-prepend"><a href="javascript:void();" data-field="sendText" class="btn btn-outline-secondary emojiButton">😀</a></div><input type="text" class="form-control" id="sendText" /><div class="input-group-append"><a id="sendMessageButton" class="btn btn-primary" style="border-radius:0px" href="javascript:sendMessage();">Send</a></div></div>'
        + '</div>';

    result += '<div id="chatName">'
        + ' <div class="form-group">'
        + '     <label>Enter your name to chat:</label>'
        + '     <div class="input-group"><input type="text" class="form-control" id="nameText" placeholder="Your Name" /><div class="input-group-append"><a class="btn btn-primary" id="setNameButton" style="border-radius:0px" href="javascript:setName(\'chat\');">Set Name</a></div></div>'
        + ' </div>'
        + '</div>';

    result += '</div>';
    return result;
}

function getPrayerDiv() {
    var result = '<div id="prayerContainer">';
    result += '<div id="prayerReceive"><p><i>You are in private prayer mode.  Messages posted here are only visible to you and the host responding to your prayer request.</i></p></div>';

    result += '<div id="prayerSend" style="display:none;">'
        + ' <div class="input-group" id="prayerSendInput" style="display:none;"><div class="input-group-prepend"><a href="javascript:void();" data-field="prayerSendText" class="btn btn-outline-secondary emojiButton">😀</a></div><input type="text" class="form-control" id="prayerSendText" /><div class="input-group-append"><a id="prayerSendMessageButton" class="btn btn-primary" style="border-radius:0px" href="javascript:prayerSendMessage();">Send</a></div></div>'
        + '<div id="requestPrayer" style="display:none;"><a id="requestPrayerButton" class="btn btn-primary btn-block" style="border-radius:0px" href="javascript:requestPrayer();">Request Prayer</a></div>'
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
