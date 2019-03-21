import React from 'react';

import { EventCard, EventTimeDiv } from '../../styles/Events.jsx';

export default function EventCreator(props) {
  // renders individual action
  const {
    action, id, addAction, actionTime, selectedEvent, index, eventTimes,
  } = props;

  let displayTime;
  let timeDifference;

  if (id === 0) {
    displayTime = '00: 00: 00';
  } else {
    timeDifference = eventTimes[id] - eventTimes[id - 1];
    timeDifference = new Date(timeDifference);
    
    let minute = timeDifference.getMinutes();
    minute < 10 ? minute = '0' + minute : minute;
    let second = timeDifference.getSeconds();
    second < 10 ? second = '0' + second : second;
    let millisecond = Math.floor(timeDifference.getMilliseconds() / 10);
    millisecond < 10 ? millisecond = '0' + millisecond : millisecond;

    displayTime = `${minute} : ${second} : ${millisecond}`;
  }

  return (
    <EventCard id={id} onClick={addAction} selectedEvent={selectedEvent}>
      &#x2630;{action}
      <EventTimeDiv id={id} selectedEvent={selectedEvent}>{displayTime}</EventTimeDiv>
    </EventCard>

  );
}
