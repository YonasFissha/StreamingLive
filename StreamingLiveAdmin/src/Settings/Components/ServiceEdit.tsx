import React from 'react';
import { ServiceInterface, ApiHelper, InputBox } from './';
import { Duration } from './Duration';
import { Row, FormGroup, Col, InputGroup } from 'react-bootstrap'

interface Props { currentService: ServiceInterface, updatedFunction?: () => void }

export const ServiceEdit: React.FC<Props> = (props) => {
    const [currentService, setCurrentService] = React.useState<ServiceInterface>(null);
    const handleDelete = () => { ApiHelper.apiDelete('/services/' + currentService.id).then(() => { setCurrentService(null); }); props.updatedFunction(); }
    const checkDelete = () => { if (currentService.id > 0) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        var s = { ...currentService };
        switch (e.currentTarget.name) {
            case 'serviceTime': s.serviceTime = new Date(val); break;
            case 'chatBefore': s.chatBefore = parseInt(val); break;
            case 'chatAfter': s.chatAfter = parseInt(val); break;
            case 'provider': s.provider = val; break;
            case 'key': s.providerKey = val; break;
            case 'recurs': s.recurring = val === 'true'; break;
        }
        setCurrentService(s);
    }

    const handleSave = () => {
        //set video url
        ApiHelper.apiPost('/services', [currentService]);
        props.updatedFunction();
    }

    const setVideoUrl = () => {
        var result = currentService.providerKey;
        switch (currentService.provider) {
            case "youtube_live":
            case "youtube_watchparty":
                result = "https://www.youtube.com/embed/" + currentService.providerKey + "?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1";
                break;
            case "vimeo_live":
            case "vimeo_watchparty":
                result = "https://player.vimeo.com/video/" + currentService.providerKey + "?autoplay=1";
                break;
            case "facebook_live":
                result = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D" + currentService.providerKey + "&show_text=0&autoplay=1&allowFullScreen=1";
                break;
        }
    }


    React.useEffect(() => { setCurrentService(props.currentService); }, [props.currentService]);

    var keyLabel = <>Video Embed Url</>;
    var keyPlaceholder = "https://yourprovider.com/yoururl/"

    switch (currentService.provider) {
        case "youtube_live":
        case "youtube_watchparty":
            keyLabel = <>YouTube Video ID <span className="description">Ex: https://www.youtube.com/watch?v=<b>abcd1234</b></span></>;
            keyPlaceholder = "abcd1234";
            break;
        case "vimeo_live":
        case "vimeo_watchparty":
            keyLabel = <>Vimeo ID <span className="description">Ex: https://vimeo.com/<b>123456789</b></span></>;
            keyPlaceholder = "123456789";
            break;
        case "facebook_live":
            keyLabel = <>Facebook Video ID <span className="description">Ex: https://facebook.com/video.php?v=<b>123456789</b></span></>;
            keyPlaceholder = "123456789";
            break;
    }


    return (
        <InputBox headerIcon="far fa-calendar-alt" headerText="Edit Service" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete} >
            <Row>
                <Col>
                    <FormGroup>
                        <label>Service Time</label>
                        <input type="datetime-local" className="form-control" name="serviceTime" value={currentService.serviceTime.toLocaleString()} onChange={handleChange} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Total Service Duration</label>
                        <Duration totalSeconds={currentService.duration} updatedFunction={totalSeconds => { var s = { ...currentService }; s.duration = totalSeconds; setCurrentService(s); }} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Enable Chat and Prayer</label>
                        <Row>
                            <Col>
                                <InputGroup>
                                    <input type="number" className="form-control" min="0" step="1" name="chatBefore" value={currentService.chatBefore} onChange={handleChange} />
                                    <div className="input-group-append"><label className="input-group-text">min before</label></div>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <input type="number" className="form-control" min="0" step="1" name="chatAfter" value={currentService.chatAfter} onChange={handleChange} />
                                    <div className="input-group-append"><label className="input-group-text">min after</label></div>
                                </InputGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Start Video Early <span className="description"> (Optional) For videos with countdowns</span></label>
                        <Duration totalSeconds={currentService.earlyStart} updatedFunction={totalSeconds => { var s = { ...currentService }; s.earlyStart = totalSeconds; setCurrentService(s); }} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Video Provider</label>
                        <select id="Provider" className="form-control" name="provider" value={currentService.provider} onChange={handleChange} >
                            <optgroup label="Live Stream">
                                <option value="youtube_live">YouTube</option>
                                <option value="vimeo_live">Vimeo</option>
                                <option value="facebook_live">Facebook</option>
                                <option value="custom_live">Custom Embed Url</option>
                            </optgroup>
                            <optgroup label="Prerecorded Watchparty">
                                <option value="youtube_watchparty">YouTube</option>
                                <option value="vimeo_watchparty">Vimeo</option>
                                <option value="custom_watchparty">Custom Embed Url</option>
                            </optgroup>
                        </select>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label id="videoKeyLabel">{keyLabel}</label>
                        <input id="videoKeyText" type="text" className="form-control" name="key" value={currentService.providerKey} onChange={handleChange} placeholder={keyPlaceholder} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Recurs Weekly</label>
                        <select className="form-control" asp-for="RecursWeekly" name="recurs" value={currentService.recurring.toString()} onChange={handleChange} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </FormGroup>
                </Col>
            </Row>

        </InputBox>
    );
}
