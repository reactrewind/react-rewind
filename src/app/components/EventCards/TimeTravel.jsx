import React from 'react';

// styled component
import { TimeTravelContainer, EventTimeDiv } from '../../styles/Events.jsx';

export default function TimeTavel(props) {
  const {
    toTheFuture,
    toThePast,
    setIsRecording,
    isRecording,
    setIsPlaying,
    isPlaying,
  } = props;


  return (
    <>
      <TimeTravelContainer>
        <EventTimeDiv onClick={setIsRecording}>{isRecording ? 'PAUSE' : 'RECORD'}</EventTimeDiv>
        <EventTimeDiv onClick={setIsPlaying}>{isPlaying ? 'STOP' : 'PLAY' }</EventTimeDiv>
      </TimeTravelContainer>
      <TimeTravelContainer>
        <EventTimeDiv onClick={toThePast}>PREVIOUS</EventTimeDiv>
        <EventTimeDiv onClick={toTheFuture}>NEXT</EventTimeDiv>
      </TimeTravelContainer>
    </>
  );
}
