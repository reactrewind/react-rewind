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
      addAction,
      data,
      toTheFuture,
      toThePast,
    } = this.props;
    return (
      <>
        <EventsNav />
        <EventsDisplay data={data} addAction={addAction} />
        <TimeTravel toTheFuture={toTheFuture} toThePast={toThePast} />
      </>
    );
  }
}

export default Events;
