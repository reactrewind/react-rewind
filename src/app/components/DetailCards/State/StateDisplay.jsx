import React from 'react';
import StateCard from './StateCard.jsx';

// styled component
import { DetailsWrapper } from '../../../styles/Details.jsx';

export default function State(props) {
  // stringifying data to pass down to StateCard to display
  const { actionState } = props;
  const stringData = JSON.stringify(actionState, null, '\t');

  return (
    <DetailsWrapper>
      {<StateCard stringData={stringData} />}
    </DetailsWrapper>
  );
}
