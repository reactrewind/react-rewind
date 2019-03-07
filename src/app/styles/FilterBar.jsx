import styled from 'styled-components';

export const FilterWrapper = styled.div`
  color: white;
  border-bottom: 1px solid #484C54 ;
  input[type=text]{
    font-size: 12px;
    width: 95%;
    margin-left: 5%;
    color: white;
    background-color: transparent;
    border: 0px solid #484C54;
    height: 30px;
  }

  *:focus {
    outline: none;
}
`;
