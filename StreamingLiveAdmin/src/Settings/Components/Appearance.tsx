import React from 'react';
import { InputBox, ApiHelper, StyleInterface } from './'
import { Row, Col, FormGroup } from 'react-bootstrap'
import { ImageEditor } from './ImageEditor';

interface Props { updatedFunction?: () => void }

export const Appearance: React.FC<Props> = (props) => {
    const [currentStyle, setCurrentLink] = React.useState<StyleInterface>(null);
    const [editLogo, setEditLogo] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        var s = { ...currentStyle };
        switch (e.currentTarget.name) {
            case 'homePage': s.homePage = val; break;
            case 'primary': s.primaryColor = val; break;
            case 'contrast': s.contrastColor = val; break;
        }
        setCurrentLink(s);
    }

    const getLogoEditor = () => {
        if (!editLogo) return null;
        else return <ImageEditor style={currentStyle} updatedFunction={props.updatedFunction}></ImageEditor>
    }

    const getLogoLink = () => {
        var logoImg = (currentStyle.logo === "") ? "none" : <img src={currentStyle.logo} alt="logo" className="img-fluid" />;
        return <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditLogo(true); }}>{logoImg}</a>
    }

    const handleSave = () => { ApiHelper.apiPost('/styles', [currentStyle]); props.updatedFunction(); }

    return (
        <>
            {getLogoEditor()}
            <InputBox headerIcon="fas fa-palette" headerText="Appearance" saveFunction={handleSave} >
                <div className="section">Logo</div>
                {getLogoLink()}
                <FormGroup>
                    <label>Home Page Url</label>
                    <input type="text" className="form-control" name="homePage" value={currentStyle.homePage} onChange={handleChange} />
                </FormGroup>
                <div className="section">Colors</div>
                <Row>
                    <Col>
                        <FormGroup>
                            <label>Primary</label>
                            <input type="color" className="form-control" name="primary" value={currentStyle.primaryColor} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label>Contrast</label>
                            <input type="color" className="form-control" name="contrast" value={currentStyle.primaryColor} onChange={handleChange} />
                        </FormGroup>
                    </Col>
                </Row>
            </InputBox>
        </>
    );
}