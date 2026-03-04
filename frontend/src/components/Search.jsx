import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';

function Search(){
    const location = useLocation();
    const username = location.state;
    console.log(username.username);

    return (
        <div>
            <Nav username={username.username} />
        </div>
    );
}

export default Search;