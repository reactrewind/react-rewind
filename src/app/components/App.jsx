import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components';

// containers
import SplitPane from '../container/SplitPane.jsx';
import TimeSlider from '../container/TimeSlider.jsx';

// left pane = events, right pane = details
import Events from '../container/Events.jsx';
import Details from '../container/Details.jsx';

// styled components
import { Wrapper } from '../styles/SplitPane.jsx';
import stateDifference from './stateDifference.jsx';

// import from styled components to create global styles
const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 10px;i
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
      searchField: '',
      filteredData: [],
      isPlaying: false,
      isRecording: false,
      isPlayingIndex: 0,
    };

    this.portToExtension = null;

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
    // *******************************************************
    // need to impletement setState for filteredData to same value as data
    // this.setState({ data, filteredData: data });
    // *******************************************************

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
          filteredData: [...state.data, newData],
        }));
      });
    });
  }

  // functionality to change 'play' button to 'stop'
  setIsPlaying() {
    if (this.state.isPlayingIndex > this.state.data.length - 1) {
      this.setState({ isPlayingIndex: 0 });
    }

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

    // we query the active window so we can send it to the background script
    // so it knows on which URL to run our devtool.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const { url } = tabs[0];

      // backgroundPort is a variable made avaiable by the devtools.js 
      backgroundPort.postMessage({
        turnOnDevtool: true,
        url,
      });
    });
  }

  actionInPlay() {
    let { isPlayingIndex } = this.state;
    const { isPlaying, data } = this.state;

    if (isPlayingIndex >= data.length - 1) isPlayingIndex = 0;

    this.setState({ isPlayingIndex: isPlayingIndex + 1 });
    const { id, action, state } = data[isPlayingIndex + 1];
    this.toTheFuture();

    setTimeout(() => {
      this.setState((prev, props) => {
        return { ...prev, id, action, state };
      });
      if (isPlaying && isPlayingIndex + 1 < data.length - 1) {
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
  searchChange(e) {
    const { data } = this.state;

    // grab user entry from filter bar
    const compareSearchValue = e.target.value;

    // set state with compare value
    this.setState({ searchField: compareSearchValue });

    // match results from our filter entry to data
    const actions = data.filter(function(item) {
      const type = item.action.type.toLowerCase();
      return type.includes(compareSearchValue.toLowerCase());
    });
    this.setState({ filteredData: actions });
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
    const {
      action,
      id,
      state,
      data,
      setIsPlaying,
      isPlaying,
      setIsRecording,
      isRecording,
      filteredData,
    } = this.state;

    return (
      <>
        <GlobalStyle />
        <Wrapper>
          <SplitPane
            left={
              (
                <Events
                  data={data}
                  addAction={this.addActionToView}
                  activeEventId={id}
                  searchChange={this.searchChange}
                  filteredData={filteredData}
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
        </Wrapper>
      </>
    );
  }
}

export default App;
