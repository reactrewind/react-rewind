import React from 'react';

export default function EventCreator(props) {
  // renders individual action
  const { action, id, addAction } = props;

  return (
    <div id={id} onClick={ addAction }>
      {action}
    </div>
  );
}
