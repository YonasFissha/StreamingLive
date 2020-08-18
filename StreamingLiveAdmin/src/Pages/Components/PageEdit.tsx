import React from 'react';
import { PageInterface, ApiHelper, InputBox } from '.'
import { FormGroup } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState } from 'draft-js';

interface Props { page: PageInterface, updatedFunction: () => void }

export const PageEdit: React.FC<Props> = (props) => {
    const [page, setPage] = React.useState<PageInterface>(null);
    const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty());

    const handleDelete = () => { ApiHelper.apiDelete('/pages/' + page.id).then(() => { setPage(null); }); props.updatedFunction(); }
    const checkDelete = () => { if (page.id > 0) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        var p = { ...page };
        switch (e.currentTarget.name) {
            //case 'text': t.text = val; break;
            //case 'type': t.tabType = val; break;
            //case 'page': t.tabData = val; break;
            //case 'url': t.url = val; break;
        }
        setPage(p);
    }

    const handleSave = () => {
        //var content = editorState.getCurrentContent();
        ApiHelper.apiPost('/pages', [page]);
        props.updatedFunction();
    }

    const handleEditorChange = (e: EditorState) => {
        setEditorState(e);
    }

    const init = () => {
        setPage(props.page);
        //setEditorState(EditorState.createWithContent(ContentState.createFromText(page.content)));
    }

    React.useEffect(() => { init(); }, [props.page]);

    return (
        <InputBox headerIcon="fas fa-code" headerText="Edit Page" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete} >
            <FormGroup>
                <label>Page Name</label>
                <input type="text" className="form-control" name="name" />
            </FormGroup>
            <FormGroup>
                <label>Contents</label>
                <Editor editorState={editorState} onEditorStateChange={handleEditorChange} />
            </FormGroup>
        </InputBox>
    );
}