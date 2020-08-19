import React, { useCallback } from 'react';
import { InputBox, ApiHelper, StyleInterface } from './';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from 'react-bootstrap';


interface Props {
    style: StyleInterface,
    updatedFunction: () => void
}

export const ImageEditor: React.FC<Props> = (props) => {
    const [originalUrl, setOriginalUrl] = React.useState('about:blank');
    const [currentUrl, setCurrentUrl] = React.useState('about:blank');
    const [dataUrl, setDataUrl] = React.useState(null);
    var timeout: any = null;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let files;
        if (e.target) files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            var url = reader.result.toString();
            setCurrentUrl(url);
            setDataUrl(url);
        };
        reader.readAsDataURL(files[0]);
    }

    const getHeaderButton = () => {
        return (<div>
            <input type="file" onChange={handleUpload} id="fileUpload" accept="image/*" style={{ display: 'none' }} />
            <Button size="sm" variant="info" onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById('fileUpload').click(); }} >Upload</Button>
        </div>);
    }

    const cropper = React.useRef(null);

    const cropCallback = () => {
        if (cropper.current !== null) {
            var url = cropper.current.getCroppedCanvas({ width: 400, height: 300 }).toDataURL();
            setDataUrl(url);
        }
    }

    const handleCrop = () => {
        if (timeout !== null) {
            window.clearTimeout(timeout);
            timeout = null;
        }
        timeout = window.setTimeout(cropCallback, 200);
    }

    const handleSave = () => { ApiHelper.apiPost('/styles/photo', [{ url: dataUrl }]).then((d) => { props.updatedFunction(); }); }
    const handleCancel = () => { props.updatedFunction(); }
    const init = useCallback(() => {
        var startingUrl = props.style.logo
        setOriginalUrl(startingUrl);
        setCurrentUrl(startingUrl);
    }, []);

    React.useEffect(init, []);

    return (
        <InputBox id="cropperBox" headerIcon="" headerText="Crop" saveFunction={handleSave} saveText={"Update"} cancelFunction={handleCancel} headerActionContent={getHeaderButton()}  >
            <Cropper
                ref={cropper}
                src={currentUrl}
                style={{ height: 360, width: '100%' }}
                aspectRatio={4 / 3}
                guides={false}
                crop={handleCrop} />
        </InputBox>
    );
}
