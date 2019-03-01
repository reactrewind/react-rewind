import React, { useContext, Component } from 'react';
import { createGlobalStyle } from 'styled-components';

// data
import data from '../data.jsx'

// containers
import SplitPane from '../container/SplitPane.jsx';

// left pane = events, right pane = details
import Events from '../container/Events.jsx';
import Details from '../container/Details.jsx';

// import from styled components to create global styles
const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 10px;
    height: 100%;
    width: 100%;
  }
  * *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    height: 100%;
    width: 100%;
    background-color: #393939;
  }
`;


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.addActionToView = this.addActionToView.bind(this);
    // this.toTheFuture = this.toTheFuture.bind(this);
  }

  componentDidMount() {
    // adds listener to the effects that are gonna be sent from
    // our edited useReducer from the 'react' library.
    chrome.runtime.onConnect.addListener((portFromExtension) => {
      portFromExtension.onMessage.addListener(msg => {
        const newData = { action: msg.action, state: msg.state, id: this.state.data.length };
        const newDataArray = [...this.state.data, newData];
        this.setState({ data: newDataArray });
      });
    });
  }

  // function to select an event from the data
  // and set state with all required info
  addActionToView(e) {
    const actionToView = this.state.data.filter(action => e.target.id === String(action.id));
    const {
      action, id, payload, state,
    } = actionToView[0];
    this.setState({
      action, id, payload, state,
    });
  }

  // function to travel to the FUTURE
  // **** not being passed to any children yet
  //   toTheFuture(e) {
  //     if (this.state.action) {
  //       for (let i = 0; i < data.length - 1; i += 1) {
  //         // clicking next returns next piece of data
  //         if (data[i].id === this.state.id) {
  //           const { action, id, payload, state } = data[i + 1];
  //           this.setState({action, id, payload, state});
  //         }
  //         // if we're at the last action stop there
  //         // don't let user go any further
  //         if (data[i].id === undefined) {
  //           const { action, id, payload, state } = data[data.length -1 ];
  //           this.setState({action, id, payload, state});
  //         }
  //     }
  //   }
  // }

  render() {
    const {
      action, id, payload, state, data
    } = this.state;
    return (
      <>
        <GlobalStyle />
        <SplitPane
          left={
            <Events data={data} addAction={this.addActionToView} />
          }
          right={
            (
              <Details
                action={action}
                id={id}
                payload={payload}
                actionState={state}
              />
            )}
        />
      </>
    );
  }
}

export default App;