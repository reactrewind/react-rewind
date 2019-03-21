import React from 'react';
import StateCard from './StateCard.jsx';

// styled component
import { DetailsWrapper } from '../../../styles/Details.jsx';

export default function State({ actionState, setIsClicked }) {
  // stringifying data to pass down to StateCard to display
  setIsClicked(true);
  return (
    <DetailsWrapper>
        {<StateCard actionState={actionState} />}
    </DetailsWrapper>
  );
}
