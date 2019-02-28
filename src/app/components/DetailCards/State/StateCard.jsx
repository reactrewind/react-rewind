import React from 'react';

export default function EffectCard(props) {
  // renders the data to show
  const { stringData } = props;
  return (
    <div>
      { stringData || 'select an event'}
    </div>
  );
}
