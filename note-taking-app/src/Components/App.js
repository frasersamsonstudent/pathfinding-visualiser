import './App.css';

export default function App() {
  return (
    <div className="App">
      <div className = "pageHeader">Header</div>

      <div className="mainContent">
        <div className="sidePanel">
          <div className="title">Panel</div>
          <div className="panelItem">item</div>
        </div>
        
        <div className="divider"></div>
        <div className="editorContainer">editor</div>
      </div>
    </div>
  );
};
