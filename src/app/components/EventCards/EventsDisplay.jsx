import React, { useContext, useState } from 'react';

// components import
import EventCreator from './EventCreator.jsx';
import TimeTravel from './TimeTravel.jsx';

// styled components import
import { EventsWrapper } from '../../styles/Events.jsx';

// data context import
import { DataContext } from '../../index.js'

export default function Events(props) {
  return (
    <EventsWrapper>
      {props.data.map((e, i) => (
        <EventCreator
          action={e.action.type}
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
