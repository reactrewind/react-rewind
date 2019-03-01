import styled from "styled-components";

// events nav wrapper
export const EventsNavWrapper = styled.div`
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 17%;
  border-bottom: 4px double blue;
  color: white;
`;


// details nav wrapper
export const DetailsNavWrapper = styled.div`
  background-color: #000;
  width: 100%;
  height: 17%;
  border-bottom: 4px double blue;
  color: white;
`;


// details buttons container (actions effects state)
export const Buttons = styled.div`
  width: 100%;
  height: 100%;
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;

  a {
    height: 100%;
    width: 100%;
    text-decoration: none;
    color: white;

    &.active {
    color: white;
    background-color: blue;
    /* border-bottom: 3px solid white; */
    }
  }

`;

// individal button styling (actions, effects, state)
export const Button = styled.div`
  /* border-right: 1px solid black; */
  /* color: ${props => props.selected ? "black" : "black"} */
  /* background: ${props => props.selected ? "lavender" : "null"}; */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: black;
  }

  :hover {
    background: blue;
    color: white;
    /* border-bottom: 3px solid black; */
  }

`;
