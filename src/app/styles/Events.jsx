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
  color: black;
  padding-left: 5%;
  padding-right: 5%;
  border-bottom: 1px solid black;
  cursor: pointer;

  &:hover {
    color: white;
    border-bottom: 1px solid blue;
  }
`;

export const EventTimeDiv = styled.div`
  height: 15px;
  width: 25%;
  text-align: center;
  /* background-color: black; */
  color: black;
  padding: 1%;
  border-radius: 25px;
  border: 1px solid black;
`;
