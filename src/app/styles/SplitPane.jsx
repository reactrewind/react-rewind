import styled from 'styled-components';

export const FullBackground = styled.div`
  height: 100%;
  background-color: blue;
`;

export const PaneWrapper = styled.div`
  font-family: "arial";
  font-size: .80em;
  color: #E8E8F4;
  background-color: #2A2E3A;
  height: 100vh;
  display: flex;
  justify-content: space-around;
`;

export const LeftPane = styled.div`
  background-color: #2A2E3A;
  border-right: 3px double #484C54;
  height: 100%;
  width: 43%;
`;

export const RightPane = styled.div`
  color: white;
  background-color: #2A2E3A;
  height: 100%;
  width: 57%;
`;
