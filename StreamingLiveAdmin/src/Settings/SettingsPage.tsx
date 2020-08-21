import React from 'react';
import { Preview, Services, Appearance, Links, Tabs } from './Components'
import { Row, Col } from 'react-bootstrap'

export const SettingsPage = () => {
    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-video"></i> Live Stream</h1></div>
                <div className="col text-right"><a asp-page-handler="Publish" className='btn btn-primary btn-lg' id="PublishButton">Publish Changes</a></div>
            </Row>
            <Row>
                <Col md={8}>
                    <Preview />
                    <Services />
                </Col>
                <Col md={4}>
                    <Appearance />
                    <Links />
                    <Tabs />
                </Col>
            </Row>
        </>
    );
}
