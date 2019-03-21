import React from 'react';
import ReactJson from 'react-json-view';
import { DetailsWrapper } from '../../../styles/Details.jsx';
// functionality
// gets difference from previous state to new state
import stateDifference from '../../stateDifference.jsx';


export default function Effects(props) {
  const { prevState, actionState, setIsClicked } = props;
  const differenceOfPrevAndNextState = stateDifference(prevState, actionState);
  setIsClicked(true);
  return (
    <DetailsWrapper>
      <ReactJson
        theme="threezerotwofour"
        style={{ backgroundColor: 'transparent', height: '-webkit-fill-available' }}
        displayDataTypes={false}
        src={differenceOfPrevAndNextState}
      />
    </DetailsWrapper>
  );
}
