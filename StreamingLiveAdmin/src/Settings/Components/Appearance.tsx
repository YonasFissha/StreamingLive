import React from 'react';
import { ApiHelper, SettingInterface, AppearanceEdit, ImageEditor, DisplayBox } from '.'
import { Row, Col, FormGroup } from 'react-bootstrap'

interface Props { updatedFunction?: () => void }

export const Appearance: React.FC<Props> = (props) => {
    const [currentSettings, setCurrentSettings] = React.useState<SettingInterface>();
    const [mode, setMode] = React.useState("display");

    const loadData = () => { ApiHelper.apiGet('/settings').then(data => setCurrentSettings(data[0])); }
    const handleEdit = () => { setMode("edit"); }
    const handleUpdate = () => { setMode("display"); loadData() }

    const getLogoLink = () => {
        var logoImg = (currentSettings && currentSettings?.logoUrl !== "") ? <img src={currentSettings.logoUrl} alt="logo" className="img-fluid" /> : "No Logo";
        return <a href={currentSettings?.homePageUrl} target="_blank">{logoImg}</a>
    }

    React.useEffect(() => { loadData(); }, []);

    if (mode === "edit") return (<AppearanceEdit settings={currentSettings} updatedFunction={handleUpdate} />)
    else return (
        <DisplayBox headerIcon="fas fa-palette" headerText="Appearance" editFunction={handleEdit} >
            {getLogoLink()}
            <div className="section">Colors</div>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Primary</label>
                        <input type="color" className="form-control" name="primary" value={currentSettings?.primaryColor} disabled={true} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Contrast</label>
                        <input type="color" className="form-control" name="contrast" value={currentSettings?.contrastColor} disabled={true} />
                    </FormGroup>
                </Col>
            </Row>
        </DisplayBox>
    );
}