import styled from 'styled-components';

// the entire events display wrapper
export const EventsWrapper = styled.div`
  height: -webkit-fill-available;
  overflow: auto;
`;

// single event card
export const EventCard = styled.div`
  background-color: ${props => props.selectedEvent === 'false' ? 'none' : "#4F5A65"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  color: white;
  padding-left: 5%;
  padding-right: 5%;
  border-bottom: 1px solid #484C54;
  cursor: pointer;

  &:hover {
    color: ${props => props.selectedEvent === 'false' ? '#4F5A65' : "white"};
    border-bottom: 1px solid #4F5A65;
  }
`;

// time card on event card
export const EventTimeDiv = styled.div`
  width: 25%;
  text-align: center;
  background-color: ${props => props.selectedEvent === 'false' ? '#484C54' : "#3C444F"};
  color: ${props => props.selectedEvent === 'false' ? 'white' : "white"};
  border-radius: 5px;
`;
