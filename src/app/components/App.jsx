import React, { useContext, Component } from 'react';
import { createGlobalStyle } from 'styled-components';

// containers
import SplitPane from '../container/SplitPane.jsx';
import TimeSlider from '../container/TimeSlider.jsx';

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
      isPlaying: false,
      isRecording: false,
      isSearching: false,
      isPlayingIndex: 0,
    };

    this.portToExtension = null;
    this.portToBackground = null;

    this.addActionToView = this.addActionToView.bind(this);
    this.toTheFuture = this.toTheFuture.bind(this);
    this.toThePast = this.toThePast.bind(this);
    this.setIsPlaying = this.setIsPlaying.bind(this);
    this.setIsRecording = this.setIsRecording.bind(this);
    this.actionInPlay = this.actionInPlay.bind(this);
    this.handleBarChange = this.handleBarChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentDidMount() {
    // adds listener to the effects that are gonna be sent from
    // our edited useReducer from the 'react' library.
    chrome.runtime.onConnect.addListener((portFromExtension) => {
      this.portToExtension = portFromExtension;

      portFromExtension.onMessage.addListener((msg) => {
        const newData = {
          action: msg.action,
          state: msg.state,
          id: this.state.data.length,
        };
        this.setState((state) => ({
          data: [...state.data, newData],
        }));
      });
    });

    // we create a port to communicate with the background. This is used
    // to start recording the dispatches. We need to tell the background
    // to start intercepting the requests on this page and refresh it.
    this.portToBackground = chrome.runtime.connect({
      name: 'DevTools-Background Connection',
    });
    this.portToBackground.onDisconnect.addListener(() => console.log('Disconecting from bg...'));
  }

  // functionality to change 'play' button to 'stop'
  setIsPlaying() {
    if (this.state.isPlayingIndex > this.state.data.length - 1) {
      this.setState({ isPlayingIndex: 0 });
    }

    console.log('isplaying');
    let { isPlaying } = this.state;
    isPlaying = !isPlaying;
    this.setState({ isPlaying });

    if (isPlaying) {
      this.actionInPlay();
    }
  }

  // functionality to change 'record' button to 'pause'
  setIsRecording() {
    console.log('setIsRecording:', this.state.isRecording)
    this.setState(state => ({
      isRecording: !state.isRecording,
    }));

    backgroundPort.postMessage({
      active: true
    });
  }

  actionInPlay() {
    let { isPlayingIndex } = this.state;
    if (isPlayingIndex >= this.state.data.length - 1) isPlayingIndex = 0;

    this.setState({ isPlayingIndex: isPlayingIndex + 1 });
    const { id, action, state } = this.state.data[isPlayingIndex + 1];

    setTimeout(() => {
      this.setState((prev, props) => {
        return { ...prev, id, action, state };
      });
      if (this.state.isPlaying && isPlayingIndex + 1 < this.state.data.length - 1) {
        this.actionInPlay();
      } else {
        this.setState({ isPlaying: false });
      }
    }, 1000);
  }

  // function to select an event from the data
  // and set state with all required info
  addActionToView(e) {
    const { data } = this.state;
    const actionToView = data.filter(action => e.target.id === String(action.id));
    const {
      action, id, state,
    } = actionToView[0];
    this.setState({
      action, id, state,
    });
  }

  // filter search bar results
  // *** NOT FINISHED ***
  searchChange(e) {
    const { data } = this.state;
    console.log(data);
  }

  // time travel bar change
  handleBarChange(e) {
    const { data } = this.state;
    const { id, action, state } = data[e.target.value];

    this.setState({
      id,
      action,
      state,
      isPlayingIndex: parseInt(e.target.value),
    });
  }

  // function to travel to the FUTURE
  toTheFuture() {
    if (!this.portToExtension) return console.error('No connection on stored port.');
    this.portToExtension.postMessage({
      type: 'TIMETRAVEL',
      direction: 'forward',
    });
  }

  // function to travel to the PAST
  toThePast() {
    if (!this.portToExtension) return console.error('No connection on stored port.');
    this.portToExtension.postMessage({
      type: 'TIMETRAVEL',
      direction: 'backwards',
    });
  }

  render() {
    console.log(this.state.isPlayingIndex);
    const {
      action,
      id,
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
                activeEventId={id}
              />
            )}
          right={
            (
              <Details
                action={action}
                id={id}
                actionState={state}
              />
            )}
        />
        <TimeSlider
          data={data}
          toTheFuture={this.toTheFuture}
          toThePast={this.toThePast}
          isPlaying={isPlaying}
          isPlayingIndex={this.state.isPlayingIndex}
          isRecording={isRecording}
          setIsPlaying={this.setIsPlaying}
          setIsRecording={this.setIsRecording}
          handleBarChange={this.handleBarChange}
        />
      </>
    );
  }
}

export default App;
