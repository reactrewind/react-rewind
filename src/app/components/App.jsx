import React, { useContext, Component } from 'react';

// containers
import SplitPane from '../container/SplitPane.jsx';

// left pane = events, right pane = details
import Events from '../container/Events.jsx';
import Details from '../container/Details.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this.addActionToView = this.addActionToView.bind(this);
    // this.toTheFuture = this.toTheFuture.bind(this);
  }

  componentDidMount() {
    // adds listener to the effects that are gonna be sent from
    // our edited useReducer from the 'react' library.
    chrome.runtime.onConnect.addListener((portFromExtension) => {
      portFromExtension.onMessage.addListener((msg) => {
        const { data } = this.state;
        const newData = {
          action: msg.action,
          state: msg.state,
          id: data.length,
        };
        this.setState((state) => ({
          data: [...state.data, newData]
        }));
      });
    });
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

  startRecording() {
    chrome.storage.sync.set({ isAppTurnedOn: true }, () => console.log('turned on application'));
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
  }

  stopRecording() {
    chrome.storage.sync.set({ isAppTurnedOn: false }, () => console.log('turned on application'));
  }

  recordingValue() {
    chrome.storage.sync.get(['isAppTurnedOn'], appStatus => console.log('App status: ', appStatus));
  }

  render() {
    const {
      action, id, payload, state, data,
    } = this.state;
    return (
      <React.Fragment>
        <button onClick={this.startRecording} type="submit">Start Recording</button>
        <button onClick={this.stopRecording} type="submit">Stop Recording</button>
        <button onClick={this.recordingValue} type="submit">Gimme the value</button>
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
      </React.Fragment>
    );
  }
}

export default App;
