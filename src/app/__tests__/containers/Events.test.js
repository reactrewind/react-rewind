import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Events from '../../container/Events.jsx';

configure({ adapter: new Adapter() });

describe('<Events />', () => {
  const props = {
    activeEventId: 0,
    addAction: () => {},
    data: {},
    searchChange: () => {},
    filteredData: {},
    searchField: {},
    eventTimes: {},
  };
  it('renders <FilterBar /> component', () => {
    const wrapper = shallow(<Events {...props} />);
    expect(wrapper.find('FilterBar')).toHaveLength(1);
  });
  it('renders <EventsDisplay /> component', () => {
    const wrapper = shallow(<Events {...props} />);
    expect(wrapper.find('EventsDisplay')).toHaveLength(1);
  });
  it('renders <EventsNav /> component', () => {
    const wrapper = shallow(<Events {...props} />);
    expect(wrapper.find('EventsNav')).toHaveLength(1);
  });
});
