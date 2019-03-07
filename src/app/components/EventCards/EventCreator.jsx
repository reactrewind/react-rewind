import React from 'react';

import { EventCard, EventTimeDiv } from '../../styles/Events.jsx';

export default function EventCreator(props) {
  // renders individual action
  const {
    action, id, addAction, actionTime, selectedEvent,
  } = props;
  return (
    <EventCard id={id} onClick={addAction} selectedEvent={selectedEvent}>
      &#x2630;{action}
      <EventTimeDiv id={id} selectedEvent={selectedEvent}>{actionTime || '00:00:01'}</EventTimeDiv>
    </EventCard>

  );
}
