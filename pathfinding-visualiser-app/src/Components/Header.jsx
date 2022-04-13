import React from 'react';

const Header = ({titles, onClickFunctions, isSolving}) => {
    const getHeaderItems = () => {
        return titles.map(
            (title, index) => getHeaderButton(title, onClickFunctions[index])
        );
    };

    const getHeaderButton = (title, onClickFunction) => {
        return (
            <button 
                disabled = {isSolving}
                onClick={onClickFunction}
            >
                {title}
            </button>
        );
    };

    return <div className='header'>
        <div className="headerItemsContainer">
            {getHeaderItems()}
        </div>
    </div>
}

export default Header;