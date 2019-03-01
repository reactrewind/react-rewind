import styled from 'styled-components';

export const PaneWrapper = styled.div`
  font-family: "courier new";
  font-weight: 400;
  font-size: .80em;
  color: white;
  background-color:#393939;
  height: 350px;
  display: flex;
  justify-content: space-around;
`;

export const LeftPane = styled.div`
  background-color: #393939;
  border-right: 3px solid white;
  height: 100%;
  width: 43%;
`;

export const RightPane = styled.div`
  color: white;
  background-color: #393939;
  height: 100%;
  width: 57%;
`;
