import React, { useContext, useState, Component} from 'react';

// components
import EventsNav from '../components/EventCards/EventsNav.jsx';
import EventsDisplay from '../components/EventCards/EventsDisplay.jsx'

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { addAction, data } = this.props;
    return (
      <>
        <EventsNav />
        <EventsDisplay data={data} addAction={addAction} />
      </>
    );
  }
}

export default Events;
