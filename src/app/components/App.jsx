import React, { useContext, Component } from 'react';
import { createGlobalStyle } from 'styled-components';

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
    background-color: #2A2E3A;
  }
`;


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isPlaying: true,
      isRecording: true,
    };

    this.port = null;
    this.addActionToView = this.addActionToView.bind(this);
    this.toTheFuture = this.toTheFuture.bind(this);
    this.toThePast = this.toThePast.bind(this);
    this.setIsPlaying = this.setIsPlaying.bind(this);
    this.setIsRecording = this.setIsRecording.bind(this);
  }

  componentDidMount() {
    // adds listener to the effects that are gonna be sent from
    // our edited useReducer from the 'react' library.
    chrome.runtime.onConnect.addListener((portFromExtension) => {
      this.port = portFromExtension;

      portFromExtension.onMessage.addListener((msg) => {
        const newData = {
          action: msg.action,
          state: msg.state,
          id: this.state.length,
        };
        this.setState((state) => ({
          data: [...state.data, newData]
        }));
      });
    });
  }

  // functionality to change 'play' button to 'stop'
  setIsPlaying() {
    console.log('setIsPlaying:', this.state.isPlaying)
    let { isPlaying } = this.state;
    isPlaying = !isPlaying;
    this.setState({ isPlaying });
  }

  // functionality to change 'record' button to 'pause'
  setIsRecording() {
    console.log('setIsRecording:', this.state.isRecording)
    this.setState(state => ({
      isRecording: !state.isRecording,
    }));
  }

  // function to select an event from the data
  // and set state with all required info
  addActionToView(e) {
    const { data } = this.state;
    const actionToView = data.filter(action => e.target.id === String(action.id));
    const {
      action, id, payload, state,
    } = actionToView[0];
    this.setState({
      action, id, payload, state,
    });
  }


  // function to travel to the FUTURE
  toTheFuture() {
    if (!this.port) return console.error('No connection on stored port.');
    this.port.postMessage({
      type: 'TIMETRAVEL',
      direction: 'forward',
    });
  }

  // function to travel to the PAST
  toThePast() {
    if (!this.port) return console.error('No connection on stored port.');
    this.port.postMessage({
      type: 'TIMETRAVEL',
      direction: 'backwards',
    });
  }

  render() {
    const {
      action,
      id,
      payload,
      state,
      data,
      setIsPlaying,
      isPlaying,
      setIsRecording,
      isRecording,
    } = this.state;

    return (
      <>
        <GlobalStyle />
        <SplitPane
          left={
            (
              <Events
                data={data} 
                addAction={this.addActionToView}
                toTheFuture={this.toTheFuture}
                toThePast={this.toThePast}
                isPlaying={isPlaying}
                isRecording={isRecording}
                setIsPlaying={this.setIsPlaying}
                setIsRecording={this.setIsRecording}
              />
            )}
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
