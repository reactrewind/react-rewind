import styled from 'styled-components';

// wrapper for total split pane views
export const PaneWrapper = styled.div`
  font-family: "arial";
  font-size: .80em;
  color: #E8E8F4;
  background-color: #2A2E3A;
  /* CHANGED HEIGHT FROM 100VH */
  height: 100%;
  /* margin-bottom: 30px; */
  display: flex;
  justify-content: space-around;
`;

// wrapper for events (left hand side)
export const LeftPane = styled.div`
  background-color: #2A2E3A;
  border-right: 3px double #484C54;
  height: 100%;
  width: 43%;
`;

// wrapper for details (right hand side)
export const RightPane = styled.div`
  color: white;
  background-color: #2A2E3A;
  height: 100%;
  width: 57%;
`;
