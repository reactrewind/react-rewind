import React from 'react';
import StateCard from './StateCard.jsx';

// styled component
import { DetailsWrapper } from '../../../styles/Details.jsx';

export default function State(props) {
  // stringifying data to pass down to StateCard to display
  const { actionState } = props;
  return (
    <DetailsWrapper>
        {<StateCard actionState={actionState} />}
    </DetailsWrapper>
  );
}
