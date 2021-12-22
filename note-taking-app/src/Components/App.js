import './App.css';
import React, {useEffect, useState} from 'react';
import NoteEditor from './NoteEditor';
import SidePanel from './SidePanel';
import {v4 as uuidv4} from 'uuid';

class Note {
  constructor(noteTitle, noteText, uniqueId=uuidv4()) {
    this.uniqueId = uniqueId;
    this.title = noteTitle;
    this.text = noteText;
  };
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null)
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);

  const readNotes = () => {
    setNotes([
      new Note('Note 1', 'Content for note 1'),
      new Note('Note 2', 'Some content')
    ]);
  }

  const addNote = (noteTitle, noteContent) => {
    setNotes(
      [
        ...notes, 
        new Note(noteTitle, noteContent)
      ]
    );
  };

  const updateNoteContent = (noteToUpdate, newNoteContent) => {
    setNotes(
      (existingNotes) => existingNotes.map(
        (note) => {
          if(note.uniqueId === noteToUpdate.uniqueId) {
            console.log("found");
            return new Note(note.title, newNoteContent, note.uniqueId);
          }
          else {
            return note;
          }

        }
      )
    );
  };

  // Sets the note at index to be the active note, if index is valid
  const setNoteAtIndexToActive = (index) => {
    if(notes.length > 0 && index >= 0 && index < notes.length && notes[index] !== activeNote) {
      setActiveNote(notes[index]);
      setActiveNoteIndex(index);
    };
  };
  
  useEffect(readNotes, []);

  return (
    <div className="App">
      <div className = "pageHeader">Header</div>

      <div className="mainContent">
        <div>
            <SidePanel 
              notes={notes} 
              setNoteAtIndexToActive={setNoteAtIndexToActive} 
              activeNoteIndex={activeNoteIndex}
              addNote = {addNote}
            />
        </div>
        
        <div className="divider"></div>
        <div className="editorContainer">
          <NoteEditor 
            activeNote={activeNote}
            updateNoteContent={updateNoteContent}
          />
        </div>
      </div>
    </div>
  );
};
