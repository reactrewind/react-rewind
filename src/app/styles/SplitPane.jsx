import styled from 'styled-components';

export const PaneWrapper = styled.div`
  font-family: Arial;
  background-color:lightblue;
  height: 350px;
  display: flex;
  justify-content: space-around;
`;

export const LeftPane = styled.div`
  background-color: Ghostwhite;
  border-right: 1px solid black;
  height: 100%;
  width: 43%;
`;

export const RightPane = styled.div`
  background-color: honeydew;
  height: 100%;
  width: 57%;
`;
