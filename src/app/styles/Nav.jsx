import styled from "styled-components";

// events nav wrapper
export const EventsNavWrapper = styled.div`
  background-color: lightyellow;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 17%;
  border-bottom: 1px solid black;
`;


// details nav wrapper
export const DetailsNavWrapper = styled.div`
  background-color: lavenderblush;
  width: 100%;
  height: 17%;
  border-bottom: 1px solid black;
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
    color: black;

    &.active {
    color: white;
    background-color: lavender;
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
    background: lavender;
    color: white;
  }

`;
