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
            if (currentTime <= new Date(currentService.startTime)) displayTimeRemaining(currentTime);
            else showVideo();
        } else showNoService();
    } else showNoService();
}

function showNoService() {
    currentService = null;
    $('#noVideoCell').html('<h2>Check Back for New Services</h2>');
    hideVideo();
}

function showVideo() {
    if (!$('#videoFrame').is(':visible')) {
        $('#videoFrame').show()
        $('#noVideoContent').hide();
    }
    if (currentService.videoUrl != $('#videoFrame').attr('src')) $('#videoFrame').attr('src', currentService.videoUrl);
}

function hideVideo() {
    if (!$('#noVideoContent').is(':visible')) {
        $('#videoFrame').hide()
        $('#noVideoContent').css('display', 'table');
    }
    if ($('#videoFrame').attr('src') != 'about:blank') $('#videoFrame').attr('src', 'about:blank');
}

function displayTimeRemaining(currentTime) {
    var remainingSeconds = Math.floor((new Date(currentService.countdownTime).getTime() - currentTime) / 1000);
    if (remainingSeconds > 86400) {
        var d = new Date(currentService.countdownTime);
        var formattedDate = d.toDateString() + ' - ' + d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })


        $('#noVideoCell').html('<h2>Next Service Time</h2>' + formattedDate);
    } else {

        var hours = Math.floor(remainingSeconds / 3600);
        remainingSeconds = remainingSeconds - (hours * 3600);
        var minutes = Math.floor(remainingSeconds / 60);
        seconds = remainingSeconds - (minutes * 60);
        //console.log(seconds);
        var displayTime = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2);
        $('#noVideoCell').html('<h2>Next Service Time</h2>' + displayTime);
    }

    hideVideo();

}



function loadConfig() {
    var jsonUrl = '/data/' + keyName + '/data.json?nocache=' + (new Date()).getTime();
    $.getJSON(jsonUrl, function (_data) {
        data = _data;
        setInterval(checkService, 1000);
    });

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
        if (currentTime <= new Date(s.endTime)) {
            if (result == null || new Date(s.endTime) < new Date(result.endTime)) result = s;
        }
    }
    return result;
}