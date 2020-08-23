import React from 'react';
import { UserHelper } from '../../Utils';


export const Preview = () => {
    return (
        <div className="inputBox">
            <div className="header"><i className="far fa-calendar-alt"></i> Preview</div>
            <div className="content">
                <div id="previewWrapper">
                    <iframe id="previewFrame" src={"https://" + UserHelper.currentSettings.keyName + ".streaminglive.church/?preview=1"}></iframe>
                </div>
                <p style={{ marginTop: 10, marginBottom: 10 }}>View your live site: <a href={"https://" + UserHelper.currentSettings.keyName + ".streaminglive.church/"} target="_blank">{"https://" + UserHelper.currentSettings.keyName + ".streaminglive.church/"}</a></p>
            </div>
        </div>
    );
}
