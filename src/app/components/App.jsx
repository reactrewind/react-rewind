import React, { useContext, Component } from 'react';

// data
import data from '../data.jsx'

// containers
import SplitPane from '../container/SplitPane.jsx';

// left pane = events, right pane = details
import Events from '../container/Events.jsx';
import Details from '../container/Details.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.port = null;

    this.addActionToView = this.addActionToView.bind(this);
    // this.toTheFuture = this.toTheFuture.bind(this);
  }

  componentDidMount() {
    // we add the listener to the effects that are gonna be sent from
    // our edited function on the react-dom library.
    if (this.port !== null) return;
    chrome.runtime.onConnect.addListener((portFromExtension) => {
      this.port = portFromExtension;
      this.port.onMessage.addListener(msg => {
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
    );
  }
}

export default App;