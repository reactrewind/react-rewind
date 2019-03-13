import React, { Component } from 'react';

const ReactRouter = require('react-router-dom');

const Router = ReactRouter.BrowserRouter;
const { Route } = ReactRouter;

// details nav component import
import DetailsNav from '../components/DetailCards/DetailsNav.jsx';

// component imports for react router
import ActionsDisplay from '../components/DetailCards/Actions/ActionsDisplay.jsx'
import EffectsDisplay from '../components/DetailCards/Effects/EffectsDisplay.jsx'
import StateDisplay from '../components/DetailCards/State/StateDisplay.jsx'


export default function Details(props) {
  // destructuring required info that's being passed down from App.jsx
  // passing these props onto children
  const {
    action, id, actionState,
  } = props;

  
  return (
    <Router>
      <>
        <DetailsNav />
        {/* routing components and rendering them with props */}
        <Route
          exact
          path='/'
          render={props => <ActionsDisplay {...props} action={action} />}
        />
        <Route
          path='/effects'
          render={props => <EffectsDisplay {...props} action={action} />}
        />
        <Route
          path='/state'
          render={props => <StateDisplay {...props} actionState={actionState} />}
        />
      </>
    </Router>
  );
}
