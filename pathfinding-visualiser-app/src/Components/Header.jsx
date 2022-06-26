import React from 'react';
import {Navbar, Container, NavDropdown, Nav} from 'react-bootstrap';
import './Header.css'

/**
 * 
 * @param headerItems array of elements to display in header 
 * @returns 
 */
const Header = (
    { 
        pathfindingIDToName, 
        mazeIDToName, 
        toggleWeighted, 
        isPathfindingDisabled, 
        isMazeDisabled, 
        solveGrid, 
        createMaze, 
        clearMaze, 
        selectedPathfindingAlgorithm,
        setSelectedPathfindingAlgorithm,
        selectedMazeAlgorithm,
        setSelectedMazeAlgorithm,
        isVisualising, 
    }) => {
    return <div className='header'>
        <Navbar bg = "dark" expand = "lg" variant = "dark">
            <Container>
                <Navbar.Toggle aria-controls="navbar" />
                    <Navbar.Collapse>
                        <Nav id="navbar">
                            <NavDropdown title="Select pathfinding algorithm" className="dropdown pathfindingDropdown">
                                {
                                    Object.entries(pathfindingIDToName).map(([id, name]) => {
                                        return (
                                            <NavDropdown.Item className = "dark" onClick = {() => setSelectedPathfindingAlgorithm(parseInt(id))}>
                                                {name} 
                                            </NavDropdown.Item>
                                        );
                                    })
                                }
                            </NavDropdown>

                            <NavDropdown title="Select maze algorithm" id="" className="dropdown mazeDropdown">
                                {
                                    Object.entries(mazeIDToName).map(([id, name]) => {
                                        return (
                                            <NavDropdown.Item onClick = {() => setSelectedMazeAlgorithm(parseInt(id))}>
                                                {name} 
                                            </NavDropdown.Item>
                                        );
                                    })
                                    
                                }
                            </NavDropdown>

                            <button className="btn btn-primary my-auto" onClick = {toggleWeighted} disabled = {isVisualising}>Toggle placing weighted nodes</button>                       
                            <button className="btn btn-secondary" onClick = {clearMaze} disabled = {isVisualising}>Clear maze</button>
                            <button
                                className="btn btn-success"
                                disabled = {isMazeDisabled}
                                onClick = {createMaze}
                            >
                                {selectedMazeAlgorithm !== undefined ? `Create maze with ${mazeIDToName[selectedMazeAlgorithm]}` : "Create maze"}
                            </button>  
                            <button
                                className="btn btn-success"
                                disabled = {isPathfindingDisabled}
                                onClick = {solveGrid}
                            >
                                {selectedPathfindingAlgorithm !== undefined ? `Visualise ${pathfindingIDToName[selectedPathfindingAlgorithm]}` : "Solve grid"}
                            </button>
                        </Nav>
                    </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
}

export default Header;