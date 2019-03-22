import React, { useContext, useState } from 'react';

// components import
import EventCreator from './EventCreator.jsx';

// styled components import
import { EventsWrapper } from '../../styles/Events.jsx';

export default function Events(props) {
  const {
    activeEventId,
    filteredData,
    eventTimes,
  } = props;

  return (
    <EventsWrapper>
      {filteredData.map((e, i) => (
        <EventCreator
          selectedEvent={activeEventId === e.id ? 'true' : 'false'}
          action={e.action.type}
          key={i}
          index={i}
          id={e.id}
          addAction={props.addAction}
          eventTimes={eventTimes}
        />
      ))}
    </EventsWrapper>
  );
}
