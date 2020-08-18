import React from 'react';


export const Preview = () => {
    return (
        <div className="inputBox">
            <div className="header"><i className="far fa-calendar-alt"></i> Preview</div>
            <div className="content">
                <div id="previewWrapper">
                    <iframe id="previewFrame" src="https://@(AppUser.CurrentSite.KeyName).streaminglive.church/?preview=1"></iframe>
                </div>
                <p className="margin-top:10px;margin-bottom:0px;">View your live site: <a href="https://@(AppUser.CurrentSite.KeyName).streaminglive.church/" target="_blank">https://@(AppUser.CurrentSite.KeyName).streaminglive.church/</a></p>
            </div>
        </div>
    );
}
