import React, { useContext, useState, Component} from 'react';

// components
import EventsNav from '../components/EventCards/EventsNav.jsx';
import EventsDisplay from '../components/EventCards/EventsDisplay.jsx'
import TimeTravel from '../components/EventCards/TimeTravel.jsx';
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
      toTheFuture,
      toThePast,
      searchChange,
      filteredData,
    } = this.props;
    return (
      <>
        <EventsNav />
        <FilterBar searchChange={searchChange} />
        <EventsDisplay
          data={data}
          filteredData={filteredData}
          addAction={addAction}
          activeEventId={activeEventId}
        />
        <TimeTravel
          toTheFuture={toTheFuture}
          toThePast={toThePast}
        />
      </>
    );
  }
}

export default Events;
