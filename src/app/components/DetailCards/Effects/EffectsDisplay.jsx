import React from 'react';
import { DetailsWrapper } from '../../../styles/Details.jsx';
import ReactJson from 'react-json-view';
// functionality
// gets difference from previous state to new state
import stateDifference from '../../stateDifference.jsx';


export default function Effects(props) {
  console.log('state differnce in effects display IMPORT', stateDifference);
  const differenceOfPrevAndNextState = stateDifference([1,2,3], [2,4, 9, 11, {'wow': 1}])
  return (
    <DetailsWrapper>
      <ReactJson
        theme={'threezerotwofour'}
        style={{ backgroundColor: 'transparent', height: '-webkit-fill-available' }}
        displayDataTypes={false}
        src={differenceOfPrevAndNextState}
      />
    </DetailsWrapper>
    
  );
}
