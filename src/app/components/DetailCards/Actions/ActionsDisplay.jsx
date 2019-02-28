import React from 'react';

export default function Actions(props) {
  // renders action information
  const { action, payload } = props;
  return (
    <>
      action:
      {action || 'select an event'}
      <br></br>
      payload:
      {payload || 'select an event'}
    </>
  );
}
