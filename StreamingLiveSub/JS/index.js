var videoUrl = 'about:blank';
var keyName = 'master';
var currentService = null;
var data = null;
var chatEnabled = true;

function init() {
    loadConfig();
}

function checkService() {
    if (data.services.length > 0)
    {
        currentService = determineCurrentService();
        if (currentService != null)
        {
            var currentTime = new Date().getTime();
            if (currentTime <= currentService.localStartTime) displayTimeRemaining(currentTime);
            else showVideo();
        } else showNoService();
    } else showNoService();
    toggleChatEnabled();
}

function toggleChatEnabled() {
    var currentTime = new Date().getTime();
    var result = (currentService==null) ? false : currentTime >= currentService.localChatStart && currentTime <= currentService.localChatEnd;
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
    currentService = null;
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
        //console.log(seconds);
        var displayTime = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2);
        $('#noVideoContent').html('<h2>Next Service Time</h2>' + displayTime);
    }

    hideVideo();

}



function loadConfig() {
    console.log('load config');

    var jsonUrl = '/data/' + keyName + '/data.json?nocache=' + (new Date()).getTime();
    if (getQs('preview') == 1) jsonUrl = jsonUrl.replace('data.json', 'preview.json');

    $.getJSON(jsonUrl, function (_data) {
        data = _data;
        updateServiceTimes();
        setInterval(checkService, 1000);
        var buttonHtml = '';
        for (i = 0; i < data.buttons.length; i++) {
            buttonHtml += '<td><a href="' + data.buttons[i].url + '" target="_blank" class="btn btn-secondary">' + data.buttons[i].text + '</a></td>';
        }
        $('#liveButtons').html('<div><table><tr>' + buttonHtml + '</tr></table></div>');
        $('#logo').html('<a href="' + data.logo.url + '" target="_blank"><img src="' + data.logo.image + '" /></a>')
        
        var interactHtml = '';
        var altTabs = '';
        for (i = 0; i < data.tabs.length; i++) {
            var tab = data.tabs[i];
            interactHtml += '<a id="tab' + i.toString() + '" href="#" onclick="return toggleTab(' + i.toString() + ')" class="tab"><i class="' + tab.icon + '"></i>' + tab.text + '</a>';

            console.log('**' + tab.type);
            interactHtml += '<div id="frame' + i.toString() + '"  class="frame">';
            if (tab.type == 'chat') interactHtml += getChatDiv();
            else if (tab.type == 'prayer') interactHtml += getPrayerDiv();
            else interactHtml += '<iframe src="' + tab.url + '" frameborder="0"></iframe>';
            interactHtml += '</div>'
            altTabs += '<td><a id="altTab' + i.toString() + '" href="#" onclick="return toggleTab(' + i.toString() + ')" class="altTab"><i class="' + tab.icon + '"></i></a></td>';
        }
        $('#interactionContainer').html('<table id="altTabs"><tr>' + altTabs + '</tr></table>' + interactHtml);
        toggleTab(0);

        //var customCss = ':root { --primaryColor: ' + data.colors.primary + '; --contrastColor: ' + data.colors.contrast + '; --headerColor: ' + data.colors.header + '}\n';
        //$('#customCss').html(customCss);
        var cssUrl = '/data/' + keyName + '/data.css?nocache=' + new Date().getTime();
        if (getQs('preview') == 1) cssUrl = cssUrl.replace('data.css', 'preview.css');
        $('#customCss').attr('href', cssUrl);

        initChat();

    });
}






function updateServiceTimes() {
    var timeOffset = new Date().getTimezoneOffset();
    var offsetMs = timeOffset * 60 * 1000;
    if (data.services != null) {
        for (i = 0; i < data.services.length; i++) {
            var s = data.services[i];
            s.localCountdownTime = new Date(new Date(s.serviceTime + 'Z').getTime() + offsetMs);

            s.localStartTime = new Date(s.localCountdownTime.getTime());
            s.localStartTime.setSeconds(s.localStartTime.getSeconds() - getSeconds(s.earlyStart));

            s.localEndTime = new Date(s.localStartTime.getTime());
            s.localEndTime.setSeconds(s.localEndTime.getSeconds() + getSeconds(s.duration));

            s.localChatStart = new Date(s.localCountdownTime.getTime());
            if (s.chatBefore) s.localChatStart.setSeconds(s.localChatStart.getSeconds() - getSeconds(s.chatBefore));
            else s.localChatStart.setSeconds(s.localChatStart.getSeconds() - (30*60));

            s.localChatEnd = new Date(s.localEndTime.getTime());
            if (s.chatAfter) s.localChatEnd.setSeconds(s.localEndTime.getSeconds() + getSeconds(s.chatAfter));
            else s.localChatEnd.setSeconds(s.localEndTime.getSeconds() + (30*60));
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
        if (currentTime <= s.localEndTime) {
            if (result == null || s.localEndTime < result.localEndTime) result = s;
        }
    }
    return result;
}