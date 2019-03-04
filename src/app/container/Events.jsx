import React, { useContext, useState, Component} from 'react';

// components
import EventsNav from '../components/EventCards/EventsNav.jsx';
import EventsDisplay from '../components/EventCards/EventsDisplay.jsx'
import TimeTravel from '../components/EventCards/TimeTravel.jsx';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      activeEventId,
      addAction,
      data,
      toTheFuture,
      toThePast,
      setIsPlaying,
      isPlaying,
      setIsRecording,
      isRecording,
      isPlayingIndex,
    } = this.props;
    return (
      <>
        <EventsNav />
        <EventsDisplay
          data={data}
          addAction={addAction}
          activeEventId={activeEventId}
        />
        <TimeTravel
          toTheFuture={toTheFuture}
          toThePast={toThePast}
          setIsRecording={setIsRecording}
          isRecording={isRecording}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
        />
      </>
    );
  }
}

export default Events;
