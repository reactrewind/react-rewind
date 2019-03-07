import React from 'react';

//styled components
import { DetailsWrapper } from '../../../styles/Details.jsx';

export default function Actions(props) {
  // renders action information
  const { action } = props;
  return (
    <DetailsWrapper>
      action:
      {(action && action.type) || 'select an event'}
      <br></br>
      payload:
      {(action && action.payload) || 'select an event'}
    </DetailsWrapper>
  );
}
