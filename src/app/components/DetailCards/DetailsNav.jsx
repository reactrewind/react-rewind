import React from 'react';
// styled component imports
import { Buttons, Button, DetailsNavWrapper } from '../../styles/Nav.jsx';

const { NavLink } = require('react-router-dom');

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
