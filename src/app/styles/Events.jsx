import styled from 'styled-components';

// formats the events display
export const EventsWrapper = styled.div`
  min-height: 100px;
  max-height: 200px;
  overflow: auto;
  border-bottom: 1px solid white;
`;

// events actions bar
export const EventCard = styled.div`
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
    color: #4F5A65;
    border-bottom: 1px solid #4F5A65;
  }
`;

export const EventTimeDiv = styled.div`
  width: 25%;
  text-align: center;
  background-color: #484C54;
  color: #BCBCBB;
  border-radius: 5px;
`;

export const TimeTravelContainer = styled.div`
  padding-top: 5%;
  display: flex;
  justify-content: space-evenly;
`;
