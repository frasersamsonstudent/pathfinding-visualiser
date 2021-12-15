import React, {useState} from 'react';
import {Editor, EditorState, ContentState} from 'draft-js';
import './NoteEditor.css'

export default function NoteEditor(props) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
    );
    const [currentNote, setCurrentNote] = useState(null);

    const getContextForNote = (note) => {
        return EditorState.createWithContent(
            ContentState.createFromText(note.text)
        );
    }
    const openNote = (note) => {
        setEditorState(
            getContextForNote(note)
        );
    }

    // Open note supplied by props
    if(props.activeNote !== currentNote) {
        setCurrentNote(props.activeNote);
        openNote(props.activeNote);
    };

    
    return (
        <div>
            <Editor 
                editorState = {editorState}
                onChange    = {setEditorState}
            />
        </div>
    )
}