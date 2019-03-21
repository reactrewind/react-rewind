import React from 'react';
import ReactJson from 'react-json-view';

//styled components
import { DetailsWrapper } from '../../../styles/Details.jsx';

export default function Actions(props) {
  // renders action information
  const { action } = props;
  return (
    <DetailsWrapper>
      {<ReactJson
        theme={'threezerotwofour'}
        style={{ backgroundColor: 'transparent' }}
        displayDataTypes={false}
        src={action}
      /> || 'select an event'}
    </DetailsWrapper>
  );
}
