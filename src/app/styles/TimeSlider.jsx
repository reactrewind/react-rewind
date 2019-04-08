import styled from 'styled-components';

export const SliderWrapper = styled.div`
  display: flex;
  height: 45px;
  justify-content: space-evenly;
  align-items: center;
  border-top: 1px solid #191c23;
  width: 100%;
  background-color: #3C444F;
  align-self: flex-end;

  input[type=range] {
  height: 25px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 60%;
  border-radius: 50px;
  background-color: transparent;
}
input[type=range]:focus {
  outline: none;
}
/* bar */
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: white;
  border-radius: 10px;
  border: 0px solid #000000;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 0px solid rgb(123, 123, 123);
  height: 28px;
  width: 28px;
  border-radius: 25px;
  background: rgb(230, 230, 230);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: rgb(255, 255, 255);
}
`;

export const Button = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 20px;
  width: 40px;
  color: white;
  cursor: pointer;
  font-family: 'arial';
`;
