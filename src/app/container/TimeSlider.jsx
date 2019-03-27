import React from 'react';

// styled component
import { SliderWrapper, Button } from '../styles/TimeSlider.jsx';

const TimeSlider = (props) => {
  const {
    toTheFuture,
    toThePast,
    setIsRecording,
    isRecording,
    setIsPlaying,
    isPlaying,
    isPlayingIndex,
    data,
    handleBarChange,
  } = props;

  return (
    <SliderWrapper>
      <Button onClick={setIsRecording}>{isRecording ? 'PAUSE' : 'RECORD'}</Button>
      <Button onClick={toTheFuture}>⇨</Button>
      <Button onClick={toThePast}>⇦</Button>
      <Button onClick={setIsPlaying}>{isPlaying ? '||' : '►'}</Button>
      <input
        type="range"
        min="0"
        max={data.length - 1}
        value={isPlayingIndex}
        onChange={handleBarChange}
      />
    </SliderWrapper>
  );
};

export default TimeSlider;