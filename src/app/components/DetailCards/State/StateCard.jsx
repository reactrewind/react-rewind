import React from 'react';
import ReactJson from 'react-json-view';

export default function EffectCard(props) {
  // renders the data to show
  const { actionState } = props;

  return (
    <div>
      <ReactJson
        theme={'threezerotwofour'}
        style={{ backgroundColor: 'transparent', height: '-webkit-fill-available' }}
        displayDataTypes={false}
        src={actionState}
      />
    </div>
  );
}
