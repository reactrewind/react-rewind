import React from 'react';
import StateCard from './StateCard.jsx';

export default function State(props) {
  // stringifying data to pass down to StateCard to display
  const { actionState } = props;
  const stringData = JSON.stringify(actionState, null, '\t');

  return (
    <>
      {<StateCard stringData={stringData} />}
    </>
  );
}
