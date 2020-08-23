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

    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to permanently delete this page?')) {
            ApiHelper.apiDelete('/pages/' + page.id).then(() => { setPage(null); props.updatedFunction(); });
        }
    }
    const checkDelete = () => { if (page?.id > 0) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        var p = { ...page };
        switch (e.currentTarget.name) {
            case 'name': p.name = val; break;
            //case 'type': t.tabType = val; break;
            //case 'page': t.tabData = val; break;
            //case 'url': t.url = val; break;
        }
        setPage(p);
    }

    const handleSave = () => {
        var content = editorState.getCurrentContent();
        ApiHelper.apiPost('/pages', [page]).then(props.updatedFunction);
    }

    const handleEditorChange = (e: EditorState) => {
        setEditorState(e);
    }

    const init = () => {
        setPage(props.page);
        const content = props.page?.content;

        if (content !== undefined && content !== null) setEditorState(EditorState.createWithContent(ContentState.createFromText(content)));
        else setEditorState(EditorState.createWithContent(ContentState.createFromText("")));
    }

    React.useEffect(() => { init(); }, [props.page]);

    return (
        <InputBox headerIcon="fas fa-code" headerText="Edit Page" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete()} >
            <FormGroup>
                <label>Page Name</label>
                <input type="text" className="form-control" name="name" value={page?.name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <label>Contents</label>
                <Editor editorState={editorState} onEditorStateChange={handleEditorChange} editorStyle={{ height: 400 }} />
            </FormGroup>
        </InputBox>
    );
}