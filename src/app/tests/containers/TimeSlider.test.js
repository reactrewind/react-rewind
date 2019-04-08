import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import TimeSlider from '../../container/TimeSlider';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from '../../styles/TimeSlider';
configure({ adapter: new Adapter() });

describe('<TimeSlider />', () => {
  const wrapper = shallow(<TimeSlider data={10} />);

  it('Should render 1 <input />', () => {
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('Should render 4 <Button />', () => {
    expect(wrapper.find(Button)).toHaveLength(4);
  });
});

describe('<Button />', () => {
  it('Should trigger onClick property when clicked', () => {
    const handleClick = jest.fn();
    const wrapper = mount(<Button onClick={handleClick} />);
    console.log(wrapper);
    expect(handleClick.mock.calls.length).toBe(0);
    wrapper.find('div').simulate('click');
    expect(handleClick.mock.calls.length).toBe(1);
  });
});