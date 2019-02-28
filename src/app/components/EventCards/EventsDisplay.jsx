import React, { useContext, useState } from 'react';

// components import
import EventCreator from './EventCreator.jsx';
import TimeTravel from './TimeTravel.jsx';

// styled components import
import { EventsWrapper } from '../../styles/Events.jsx';

// data context import
import { DataContext } from '../../index.js'

export default function Events(props) {
  // data context instance created
  const data = useContext(DataContext);

  return (
    <EventsWrapper>
      {data.map((e, i) => (
        <EventCreator
          action={e.action}
          key={i}
          id={e.id}
          addAction={props.addAction}
        />
      ))}
      {/* time travel doesn't work yet */}
      <TimeTravel />
    </EventsWrapper>
  );
}
