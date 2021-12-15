import React from 'react'
import './SidePanel.css'

export default function SidePanel(props) {
    const notes = []
    if(props.notes) {
        props.notes.forEach(
            (note, index) => {
                let activeOrInactiveClass = '';
                if(props.activeNoteIndex !== undefined) {
                    activeOrInactiveClass = props.activeNoteIndex === index ? ' activeNote' : ' inactiveNote';
                };

                notes.push(
                    <li 
                        key={index} 
                        className = {"panelItem" + activeOrInactiveClass}
                        onClick = {props.setNoteAtIndexToActive ? () => {props.setNoteAtIndexToActive(index)} : undefined}
                    >
                        {note.text}
                    </li>
                )
            }
        )
    }

    return (
        <div className="sidePanel">
            <div className="title">Notes2</div>
            
            <ul className="panelItemList">
                {notes}
            </ul>
        </div>
    )
}