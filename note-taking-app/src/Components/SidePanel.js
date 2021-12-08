import React from 'react'

export default function SidePanel(props) {
    const notes = []
    if(props.notes) {
        props.notes.forEach(
            (note) => {
                notes.push(
                    <li className="panelItem">note</li>
                )
            }
        )
    }

    return (
        <div className="sidePanel">
            <div className="title">Notes2</div>
            <ul>
                {notes}
            </ul>
           
            
        </div>
    )
}