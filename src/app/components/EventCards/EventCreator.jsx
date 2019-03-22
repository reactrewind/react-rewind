import React from 'react';

import { EventCard, EventTimeDiv } from '../../styles/Events.jsx';

export default function EventCreator(props) {
  // renders individual action
  const {
    action, id, addAction, selectedEvent, eventTimes,
  } = props;

  let displayTime;
  let timeDifference;

  if (id === 0) {
    displayTime = '00: 00: 00';
  } else {
    timeDifference = eventTimes[id] - eventTimes[id - 1];
    timeDifference = new Date(timeDifference);

    let minute = timeDifference.getMinutes();
    minute = minute < 10 ? '0'.concat(minute) : minute;

    let second = timeDifference.getSeconds();
    second = second < 10 ? '0'.concat(second) : second;

    let millisecond = Math.floor(timeDifference.getMilliseconds() / 10);
    millisecond = millisecond < 10 ? '0'.concat(millisecond) : millisecond;

    displayTime = `${minute} : ${second} : ${millisecond}`;
  }

  return (
    <EventCard id={id} onClick={addAction} selectedEvent={selectedEvent}>
      &#x2630;
      {action}
      <EventTimeDiv id={id} selectedEvent={selectedEvent}>{displayTime}</EventTimeDiv>
    </EventCard>

  );
}
