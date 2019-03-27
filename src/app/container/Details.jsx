import React, { useState } from 'react';

// details nav component import
import DetailsNav from '../components/DetailCards/DetailsNav.jsx';

// component imports for react router
import ActionsDisplay from '../components/DetailCards/Actions/ActionsDisplay.jsx';
import EffectsDisplay from '../components/DetailCards/Effects/EffectsDisplay.jsx';
import StateDisplay from '../components/DetailCards/State/StateDisplay.jsx';
import InitalDisplay from '../components/DetailCards/InitialDetailCard/InitialDisplay.jsx';

const ReactRouter = require('react-router-dom');

const Router = ReactRouter.BrowserRouter;
const { Route } = ReactRouter;

export default function Details(props) {
  // destructuring required info that's being passed down from App.jsx
  // passing these props onto children
  const {
    action, prevState, actionState,
  } = props;

  const [isClicked, setIsClicked] = useState(false);
  return (
    <Router>
      <>
        <DetailsNav />
        {isClicked === false ? <InitalDisplay action={action} /> : null }
        {/* routing components and rendering them with props */}
        <Route
          exact
          path='/'
          render={props => (
            <ActionsDisplay
              {...props}
              action={action}
              setIsClicked={setIsClicked}
            />
          )}
        />
        <Route
          path='/effects'
          render={props => (
            <EffectsDisplay
              {...props}
              prevState={prevState}
              setIsClicked={setIsClicked}
              actionState={actionState}
            />
          )}
        />
        <Route
          path='/state'
          render={props => (
            <StateDisplay
              {...props}
              actionState={actionState}
              setIsClicked={setIsClicked}
            />
          )}
        />
      </>
    </Router>
  );
}
