import React, { useState } from 'react';

let NavLink = require('react-router-dom').NavLink;

// styled component imports
import { Buttons, Button, DetailsNavWrapper } from '../../styles/Nav.jsx';


export default function RightNav(props) {
  return (
    <>
      <DetailsNavWrapper>
        <Buttons>
          <NavLink exact activeClassName='active' to='/'>
            <Button>actions</Button>
          </NavLink>
          <NavLink activeClassName='active' to='/effects'>
            <Button>effects</Button>
          </NavLink>
          <NavLink activeClassName='active' to='/state'>
            <Button>state</Button>
          </NavLink>
        </Buttons>
      </DetailsNavWrapper>
    </>
  );
}
