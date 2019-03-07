import styled from 'styled-components';

// from grid
export const Wrapper = styled.div`
display: grid;
height: 100vh;
grid-template-rows: 1fr auto;
`;

// wrapper for total split pane views
export const PaneWrapper = styled.div`
  font-family: "arial";
  font-size: .80em;
  color: #E8E8F4;
  background-color: #2A2E3A;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

// wrapper for events (left hand side)
export const LeftPane = styled.div`
  background-color: #2A2E3A;
  border-right: 3px double #484C54;
  width: 43%;
  display: flex;
  flex-direction: column;
`;

// wrapper for details (right hand side)
export const RightPane = styled.div`
  color: white;
  background-color: #2A2E3A;
  height: 100%;
  width: 57%;
`;
