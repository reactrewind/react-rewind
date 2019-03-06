import React from 'react';

// styled component
import { PreviousNextWrapper, PrevNextButton } from '../../styles/Events.jsx';

export default function TimeTavel(props) {
  const {
    toTheFuture,
    toThePast,
  } = props;


  return (
    <>
      <PreviousNextWrapper>
        <PrevNextButton onClick={toThePast}>PREVIOUS</PrevNextButton>
        <PrevNextButton onClick={toTheFuture}>NEXT</PrevNextButton>
      </PreviousNextWrapper>
    </>
  );
}
