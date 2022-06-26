import React from 'react';
import {Navbar, Container, NavDropdown, Nav} from 'react-bootstrap';
import './Header.css'

/**
 * 
 * @param headerItems array of elements to display in header 
 * @returns 
 */
const Header = ({ pathfindingIDToName, mazeIDToName, toggleWeighted, isPathfindingDisabled, isMazeDisabled, solveGrid, createMaze, clearMaze }) => {
    return <div className='header'>
        <Navbar bg = "light" expand = "lg">
            <Container>
                <Navbar.Toggle aria-controls="navbar" />
                    <Navbar.Collapse>
                        <Nav id="navbar">
                            <NavDropdown title="Select pathfinding algorithm" className="dropdown pathfindingDropdown">
                                {
                                    Object.entries(pathfindingIDToName).map(([id, name]) => {
                                        return (
                                            <NavDropdown.Item onClick = {() => setSelectedPathfindingAlgorithm(id)}>
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
                                            <NavDropdown.Item onClick = {() => setSelectedPathfindingAlgorithm(id)}>
                                                {name} 
                                            </NavDropdown.Item>
                                        );
                                    })
                                    
                                }
                            </NavDropdown>

                            <button className="btn btn-primary" onClick = {toggleWeighted}>Toggle placing weighted nodes</button>                       
                            <button className="btn btn-secondary" onClick = {clearMaze}>Clear maze</button>
                            <button
                                className="btn btn-success"
                                disabled = {isPathfindingDisabled}
                                onClick = {solveGrid}
                            >
                                Visualise pathfinding algorithm 
                            </button>
                            <button
                                className="btn btn-success"
                                disabled = {isMazeDisabled}
                                onClick = {createMaze}
                            >
                                Create maze
                            </button>  
                        </Nav>
                    </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
}

export default Header;