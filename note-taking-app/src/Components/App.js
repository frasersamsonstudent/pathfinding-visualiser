import './App.css';
import React, {useEffect, useState} from 'react';
import NoteEditor from './NoteEditor';
import SidePanel from './SidePanel';

export default function App() {
  const [notes, setNotes] = useState([]);

  const readNotes = () => {
    setNotes(['text1', 'text2']);
  }
  
  useEffect(readNotes, []);

  return (
    <div className="App">
      <div className = "pageHeader">Header</div>

      <div className="mainContent">
        <div>
            <SidePanel notes={notes} />
        </div>
        
        <div className="divider"></div>
        <div className="editorContainer">
          <NoteEditor />
        </div>
      </div>
    </div>
  );
};
