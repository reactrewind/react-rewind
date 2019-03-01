import styled from 'styled-components';

// formats the events display
export const EventsWrapper = styled.div`
  /* margin: 17px 17px; */
  /* padding-top: 2%; */
  /* padding-bottom: 2%; */
  height: 79%;
  overflow: auto;
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
  /* height: 15px; */
  width: 25%;
  text-align: center;
  background-color: #484C54;
  /* margin-bottom: 2%; */
  color: #BCBCBB;
  /* padding: 1%; */
  border-radius: 5px;
  /* border: 1px solid black; */
`;
