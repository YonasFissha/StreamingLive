import React from 'react';
import { Row, Col } from 'react-bootstrap'
import { UserHelper } from '../Utils';


export const ChatPage = () => {
    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <Col><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-comments"></i> Host Chat</h1></Col>
            </Row>
            <div className="alert alert-warning" role="alert">
                The host chat has moved.  Please log in <a href={"https://" + UserHelper.currentSettings.keyName + ".streaminglive.church"}>here</a> to chat as a host.
            </div>
        </>
    );
}
