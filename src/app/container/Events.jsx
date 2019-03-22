import React, { Component } from 'react';

// components
import EventsNav from '../components/EventCards/EventsNav.jsx';
import EventsDisplay from '../components/EventCards/EventsDisplay.jsx'
import FilterBar from '../components/EventCards/FilterBar.jsx';

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
      searchChange,
      filteredData,
      searchField,
      eventTimes,
    } = this.props;
    return (
      <>
        <EventsNav />
        <FilterBar searchChange={searchChange} searchField={searchField} />
        <EventsDisplay
          data={data}
          filteredData={filteredData}
          addAction={addAction}
          activeEventId={activeEventId}
          eventTimes={eventTimes}
        />
      </>
    );
  }
}

export default Events;
