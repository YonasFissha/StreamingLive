import React from 'react';
import { ChatHelper } from '../helpers';
import { FacebookProvider, LoginButton } from 'react-facebook'

interface Props { roomName: string }

export const FacebookComments: React.FC<Props> = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const [running, setRunning] = React.useState(false);
    const [token, setToken] = React.useState('');
    const [videoId, setVideoId] = React.useState('');
    const [excludeName, setExcludeName] = React.useState('');
    const [fbSource, setFbSource]: any = React.useState(null);

    const getLoginButton = () => {
        return (<div>
            <LoginButton onCompleted={handleLoginCompleted} onError={handleLoginError} className="btn btn-primary btn-sm float-right">Authorize</LoginButton>
            <div><b>Import Facebook Comments (beta)</b></div>
            <p>If you simulcast your service to Facebook, you can use this feature to make the comments from Facebook show up in this web chat.</p>
        </div>);
    }

    const handleLoginCompleted = (data: any) => { setToken(data.tokenDetail.accessToken) }

    const handleLoginError = (error: any) => { }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.currentTarget.name) {
            case "videoId": setVideoId(e.currentTarget.value); break;
            case "excludeName": setExcludeName(e.currentTarget.value); break;
        }

    }

    const handleUpdate = (e: React.MouseEvent) => {
        e.preventDefault();
        fbConnect();
        setRunning(true);
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        setRunning(false);
        setVideoId('');
    }

    const getVideoId = () => {
        return (<div >
            <div className="row" style={{ marginBottom: 10, width: "97%" }}>
                <div className="col">
                    <div className="formGroup">
                        <label>FB Video ID</label>
                        <input name="videoId" type="text" className="form-control form-control-sm" placeholder="123456789" value={videoId} onChange={handleChange} />
                    </div>
                </div>
                <div className="col">
                    <div className="formGroup">
                        <label>Exclude From</label>
                        <input name="excludeName" type="text" className="form-control form-control-sm" placeholder="John Doe" value={excludeName} onChange={handleChange} />
                    </div>
                </div>
            </div>
            <button id="setNameButton" className="btn btn-primary btn-sm btn-block" onClick={handleUpdate}>Update</button>
        </div >)
    }

    const fbConnect = () => {
        console.log(fbSource);
        if (fbSource !== null) fbSource.close();

        var url = "https://streaming-graph.facebook.com/" + videoId + "/live_comments?fields=from,message&comment_rate=one_per_two_seconds&access_token=" + token;
        var source = new EventSource(url);
        source.onmessage = function (event) {
            const data: any = JSON.parse(event.data);
            console.log(data);
            if (data.from === undefined) ChatHelper.sendFacebook(props.roomName, data.message, "From Facebook");
            else if (data.from.name !== excludeName) ChatHelper.sendFacebook(props.roomName, data.message, "Facebook: " + data.from.name);
        };
        source.onerror = function (error) { console.log(error); }
        source.onopen = function (error) { console.log("open"); }
        setFbSource(source);
    }


    const handleExpand = (e: React.MouseEvent) => { e.preventDefault(); setExpanded(true); }

    if (ChatHelper.user.isHost) {
        if (!expanded) return (<div style={{ paddingLeft: 5, paddingRight: 10, backgroundColor: "#DDD" }}>
            <span className="float-right">
                <a href="about:blank" onClick={handleExpand} style={{ color: "#999" }} ><i className="fab fa-facebook-square"></i></a>
            </span>
            Host options
        </div>);
        else {
            var content = <></>;
            if (token === '') content = getLoginButton();
            else if (running) content = <>Facebook comment import running. <a href="about:blank" onClick={handleEdit}>Edit</a></>;
            else content = getVideoId();
            return (<div id="fbComments"><FacebookProvider appId="392436265111502">{content}</FacebookProvider></div>)
        }
    } else return <></>;
}




