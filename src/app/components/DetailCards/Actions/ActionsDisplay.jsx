import React from 'react';
import ReactJson from 'react-json-view';

// styled components
import { DetailsWrapper } from '../../../styles/Details.jsx';

export default function Actions({ action, setIsClicked }) {
  // renders action information
  setIsClicked(true);
  return (
    <DetailsWrapper>
      {<ReactJson
        theme="threezerotwofour"
        style={{ backgroundColor: 'transparent' }}
        displayDataTypes={false}
        src={action}
      /> || 'select an event'}
    </DetailsWrapper>
  );
}
