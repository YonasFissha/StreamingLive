import React from 'react';
import { Preview, Services, Appearance, Links, Tabs, ApiHelper } from './Components'
import { Row, Col } from 'react-bootstrap'

export const SettingsPage = () => {

    const [ts, setTs] = React.useState(Date.now());

    const publish = (e: React.MouseEvent) => {
        e.preventDefault();
        ApiHelper.apiPost("/settings/publish", []).then(() => window.alert('Your changes have been published.'));
    }

    const updatePreview = () => {
        setTs(Date.now());
    }

    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-video"></i> Live Stream</h1></div>
                <div className="col text-right"><a href="about:blank" onClick={publish} className='btn btn-primary btn-lg' id="PublishButton">Publish Changes</a></div>
            </Row>
            <Row>
                <Col md={8}>
                    <Preview ts={ts} />
                    <Services updatedFunction={updatePreview} />
                </Col>
                <Col md={4}>
                    <Appearance updatedFunction={updatePreview} />
                    <Links updatedFunction={updatePreview} />
                    <Tabs updatedFunction={updatePreview} />
                </Col>
            </Row>
        </>
    );
}
