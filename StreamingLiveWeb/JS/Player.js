var videoUrl = 'about:blank';
var keyName = 'master';
var currentService = null;
var data = null;

function initPlayer() {
    loadConfig();
}

function checkService() {
    if (data.services.length > 0) {
        currentService = determineCurrentService();
        if (currentService != null) {
            var currentTime = new Date().getTime();
            if (currentTime <= currentService.localStartTime) displayTimeRemaining(currentTime);
            else showVideo();
        } else showNoService();
    } else showNoService();
}

function showNoService() {
    currentService = null;
    $('#noVideoContent').html('<h2>Check Back for New Services</h2>');
    hideVideo();
}

function showVideo() {

    $('#videoFrame').show()
    $('#noVideoContent').hide();

    if ($('#videoFrame').attr('src').indexOf(currentService.videoUrl) == -1) {
        $('#videoFrame').attr('src', currentService.videoUrl);
        var seconds = Math.floor((new Date().getTime() - currentService.localStartTime) / 1000);
        console.log(currentService.provider);
        if (seconds > 10) {
            if (currentService.provider = "youtube_embed") $('#videoFrame').attr('src', currentService.videoUrl + '&start=' + seconds.toString());
            if (currentService.provider = "vimeo_embed") $('#videoFrame').attr('src', currentService.videoUrl + '#t=' + seconds.toString() + "s");
        } else {
            if (currentService.provider = "youtube_embed") $('#videoFrame').attr('src', currentService.videoUrl + '&start=0');
            if (currentService.provider = "vimeo_embed") $('#videoFrame').attr('src', currentService.videoUrl + '#t=0m0s');
        }
    }
}

function hideVideo() {
    if (!$('#noVideoContent').is(':visible')) {
        $('#videoFrame').hide()
        $('#noVideoContent').css('display', 'table');
    }
    if ($('#videoFrame').attr('src') != 'about:blank') $('#videoFrame').attr('src', 'about:blank');
}

function displayTimeRemaining(currentTime) {
    hideVideo();
    var remainingSeconds = Math.floor((currentService.localCountdownTime.getTime() - currentTime) / 1000);
    if (remainingSeconds > 86400) {
        var d = currentService.localCountdownTime;
        var formattedDate = d.toDateString() + ' - ' + d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        $('#noVideoContent').html('<h2>Next Service Time</h2>' + formattedDate);
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
    var jsonUrl = '/data/' + keyName + '/data.json?nocache=' + (new Date()).getTime();
    $.getJSON(jsonUrl, function (_data) {
        data = _data;
        updateServiceTimes();
        setInterval(checkService, 1000);
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

            s.localEndTime = new Date(s.localCountdownTime.getTime());
            s.localEndTime.setSeconds(s.localEndTime.getSeconds() + getSeconds(s.duration));
        }
    }

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

function getSeconds(displayTime) {
    try {
        var parts = displayTime.split(':');
        var seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        return seconds;
    } catch (ex) {
        return 0;
    }
}