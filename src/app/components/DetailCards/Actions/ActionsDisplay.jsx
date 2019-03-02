import React from 'react';

export default function Actions(props) {
  // renders action information
  const { action } = props;
  return (
    <>
      action:
      {(action && action.type) || 'select an event'}
      <br></br>
      payload:
      {(action && action.payload) || 'select an event'}
    </>
  );
}
