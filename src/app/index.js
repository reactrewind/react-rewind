import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";

// data
import data from './data.jsx'
export const DataContext = React.createContext();

ReactDOM.render(
  <DataContext.Provider value={data}>
    <App />
  </DataContext.Provider>, document.getElementById('root')
);