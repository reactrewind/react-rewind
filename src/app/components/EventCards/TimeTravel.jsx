import React from 'react';

// styled component
import { TimeTravelContainer, EventTimeDiv } from '../../styles/Events.jsx';

export default function TimeTavel(props) {
  const { toTheFuture, toThePast } = props;
  return (
    <TimeTravelContainer>
      <EventTimeDiv onClick={toThePast}>PREVIOUS</EventTimeDiv>
      <EventTimeDiv onClick={toTheFuture}>NEXT</EventTimeDiv>
    </TimeTravelContainer>
  );
}
