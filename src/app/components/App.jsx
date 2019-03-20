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
      searchField: '',
      filteredData: [],
      isPlaying: false,
      isRecording: false,
      isPlayingIndex: 0,
      id: 0,
      action: {},
      state: {},
      prevState: {},
      eventTimes: [],
    };

    this.portToExtension = null;
    this.justStartedRecording = false;
    this.hasInjectedScript = false;

    this.addActionToView = this.addActionToView.bind(this);
    this.toTheFuture = this.toTheFuture.bind(this);
    this.toThePast = this.toThePast.bind(this);
    this.setIsPlaying = this.setIsPlaying.bind(this);
    this.setIsRecording = this.setIsRecording.bind(this);
    this.actionInPlay = this.actionInPlay.bind(this);
    this.handleBarChange = this.handleBarChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.resetApp = this.resetApp.bind(this);
  }

  componentDidMount() {
    // adds listener to the effects that are gonna be sent from
    // our edited useReducer from the 'react' library.
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== 'injected-app') return;

      this.portToExtension = port;

      port.onMessage.addListener((msg) => {
        // If the user paused the recording session, we return
        const { isRecording } = this.state;
        if (!isRecording) return;

        const newData = {
          action: msg.action,
          state: msg.state,
          prevState: msg.prevState,
          id: this.state.data.length,
        };

        // search field
        const { searchField } = this.state;
        const newDataActionType = newData.action.type.toLowerCase();
        
        // get the date everytime an action fires and add it to state

        const eventTime = Date.now();

        if (newDataActionType.includes(searchField.toLowerCase())) {
          this.setState(state => ({
            data: [...state.data, newData],
            isPlayingIndex: state.data.length,
            filteredData: [...state.filteredData, newData],
            eventTimes: [...state.eventTimes, eventTime],
          }));
        } else {
          this.setState(state => ({
            data: [...state.data, newData],
            isPlayingIndex: state.data.length,
          }));
        }
      });
    });

    // We listen to the message from devtools.js (sent originally from 
    // background) to refresh our App whenever the user refreshes the webpage.
    // The msg from background will come with the ID of the current tab.
    // We only want to refresh our App instance of that specific tab.
    window.addEventListener('message', (msg) => {
      const { action, tabId } = msg.data;
      if (action !== 'refresh_devtool') return;
      const devtoolsId = chrome.devtools.inspectedWindow.tabId;
      if (tabId === devtoolsId) this.resetApp();
    });
  }

  // functionality to change 'play' button to 'stop'
  setIsPlaying() {
    const { isPlayingIndex, data } = this.state;
    if (isPlayingIndex >= data.length - 1) {
      return;
    }

    let { isPlaying } = this.state;
    isPlaying = !isPlaying;
    this.setState({ isPlaying });

    if (isPlaying) {
      this.actionInPlay();
    }
  }

  setIsRecording() {
    // This variable will prevent the app from refreshing when we refresh 
    // the userpage.
    this.justStartedRecording = true;
    const { isRecording, hasInjectedScript } = this.state;
    this.setState(state => ({
      isRecording: !state.isRecording,
    }));

    // if we are hitting the pause or re-starting the record session
    if (isRecording || hasInjectedScript) return;

    this.setState({ hasInjectedScript: true });

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
    const { data, isPlayingIndex, isPlaying } = this.state;

    setTimeout(() => {
      this.toTheFuture();
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
      action, id, state, prevState,
    } = actionToView[0];
    this.setState({
      action, id, state, prevState,
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
    const { data, isPlayingIndex } = this.state;
    const { id, action, state, prevState } = data[e.target.value];
    // forward or past
    const currentIsPlayingIndex = e.target.value;
    const forward = currentIsPlayingIndex > isPlayingIndex;
    this.setState({
      id,
      action,
      state,
      prevState,
      isPlayingIndex: parseInt(currentIsPlayingIndex),
    });
    // Displays to screen
    if (forward) {
      this.toTheFuture();
    } else {
      this.toThePast();
    }
  }

  // function to travel to the FUTURE
  toTheFuture() {
    const { data, isPlayingIndex } = this.state;
    if (isPlayingIndex === data.length - 1) return;

    if (!this.portToExtension) return console.error('No connection on stored port.');
    this.portToExtension.postMessage({
      type: 'TIMETRAVEL',
      direction: 'forward',
    });

    const { id, action, state, prevState } = data[isPlayingIndex + 1];
    this.setState(prev => ({
      ...prev,
      id,
      action,
      state,
      prevState,
      isPlayingIndex: isPlayingIndex + 1,
    }));
  }

  // function to travel to the PAST
  toThePast() {
    const { data, isPlayingIndex } = this.state;
    if (isPlayingIndex === 0) return;

    if (!this.portToExtension) return console.error('No connection on stored port.');
    this.portToExtension.postMessage({
      type: 'TIMETRAVEL',
      direction: 'backwards',
    });

    const { id, action, state, prevState } = data[isPlayingIndex - 1];
    this.setState(prev => ({
      ...prev,
      id,
      action,
      state,
      prevState,
      isPlayingIndex: isPlayingIndex - 1,
    }));
  }

  resetApp() {
    if (this.justStartedRecording) {
      console.log('not reseting...');
      this.justStartedRecording = false;
      return;
    }
    console.log('reseting...');
    this.setState({
      data: [],
      searchField: '',
      filteredData: [],
      isPlaying: false,
      isRecording: false,
      isPlayingIndex: 0,
      id: 0,
      action: {},
      state: {},
      prevState: {},
    });
  }

  render() {
    const {
      action,
      id,
      state,
      data,
      isPlaying,
      isRecording,
      filteredData,
      searchField,
      isPlayingIndex,
      prevState,
      eventTimes,
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
                  searchField={searchField}
                  eventTimes={eventTimes}
                />
              )}
            right={
              (
                <Details
                  action={action}
                  id={id}
                  actionState={state}
                  prevState={prevState}
                />
              )}
          />
          <TimeSlider
            data={data}
            toTheFuture={this.toTheFuture}
            toThePast={this.toThePast}
            isPlaying={isPlaying}
            isPlayingIndex={isPlayingIndex}
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
