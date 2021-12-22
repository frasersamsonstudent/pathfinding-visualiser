import React, { useCallback, useEffect, useState } from 'react'
import './SidePanel.css'

export default function SidePanel(props) {
    const notes = [];
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y:0});
    const [show, setShow] = useState(false);

    const createContextMenu = useCallback(
        (event) => {
            event.preventDefault();
            setAnchorPoint({x: event.pageX, y: event.pageY});
            setShow(true);
        },
        [setAnchorPoint, setShow]
    );

    const handleClick = useCallback(
        (() => show ? setShow(false) : null), [show]
    );

    useEffect(() => {
        document.addEventListener('contextmenu', createContextMenu);
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('contextmenu', createContextMenu);
            document.removeEventListener('click', handleClick);
        }
    });

    if(props.notes) {
        props.notes.forEach(
            (note, index) => {
                let activeOrInactiveClass = '';
                if(props.activeNoteIndex !== undefined) {
                    activeOrInactiveClass = props.activeNoteIndex === index ? ' activeNote' : ' inactiveNote';
                };

                notes.push(
                    <li 
                        key={note.uniqueId} 
                        className = {"panelItem" + activeOrInactiveClass}
                        onClick = {props.setNoteAtIndexToActive ? () => {props.setNoteAtIndexToActive(index)} : undefined}
                    >
                        <h2 className="noteTitle">
                            {note.title}
                        </h2>
                        <p className="noteContent">
                            {note.text.substring(0, Math.min(15, note.text.length)) + (15 < note.text.length ? '...' : '')}
                        </p>
                    </li>
                )
            }
        )
    }

    return (
        <div className="sidePanel">
            <div className="title">Notes</div>
            
            <ul className="panelItemList">
                {notes}
            </ul>

            {
                show && (
                    <ul
                        className="contextMenu"
                        style = {{
                            top: anchorPoint.y,
                            left: anchorPoint.x
                        }}
                    >
                        <li className="contextMenuText" onClick={() => {props.addNote('Default title', '')}}>
                            Create new note
                        </li>
                    </ul>
                )
            }
        </div>
    )
}