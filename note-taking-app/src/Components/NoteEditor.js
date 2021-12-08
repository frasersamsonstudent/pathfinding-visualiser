import React, {useState} from 'react';
import {Editor, EditorState, ContentState} from 'draft-js';

export default function NoteEditor() {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
    );

    const openNote = (note) => {
        setEditorState(
            () => EditorState.createWithContent(
                ContentState.createFromText(note.text)
            )
        )
    }

    
    


    return (
        <div>
            <Editor 
                editorState = {editorState}
                onChange    = {setEditorState}
            />
            <button 
                onClick= {
                    () => {
                        openNote({'text': 'Note content'})
                    }
                }
            />
        </div>
    )
}