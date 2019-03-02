import React from 'react';

import { EventCard, EventTimeDiv } from '../../styles/Events.jsx';

export default function EventCreator(props) {
  // renders individual action
  const { action, id, addAction, actionTime } = props;
  return (
    <EventCard id={id} onClick={addAction}>
      &#x2630; {action}
      <EventTimeDiv>{actionTime || '00:00:01'}</EventTimeDiv>
    </EventCard>

  );
}
