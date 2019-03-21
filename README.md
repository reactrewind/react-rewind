<span style="display:block;text-align:center; align:center">
  <img src ="./images/greygreen_gg_full_350w.png" width="200"/>
</span>

# Rewind: A Time Travel Debugger for React *useReducer*

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/reactrewind/react-rewind/pulls) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)<br/>

A time travel debugger for React's `useReducer` hook, designed to help engineers fix bugs faster record and replay different states of their applications to fix bugs faster.
Debug your app more easily by “rewinding” your session instead of having to reproduce the issue until you find the bug.

- Press record and start interacting with your application
- Each dispatched action will be stored as a unique “event” in time
- Rewind through your recorded actions with the back buttom or by dragging the slider
- Press play to view your changing app state 


 **React Rewind is in active development. Please follow this repo for contribution guidelines and our development road map.**
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Your application must be using the hook `useReducer` for actions to be record.

### Installing
React Rewind will soon be available as a Chrome extension through the Google Chrome Web Store.

To install locally, setup instructions are as follows:

1. `git clone https://github.com/reactrewind/react-rewind.git`
2. `cd react-rewind`
3. `npm install`
4. `npm run build`
5. `Then head to [chrome://extensions/](chrome://extensions/)`
6. `Click Load Unpacked button and upload the chrome folder, located at react-rewind/src/browser/chrome.`
7. `On your application page open Chrome Developer tools and select React Rewind from the tool bar.`
8. `Click Record and begin interacting with your application.`


As you interact with your application, actions will populate the events panel. Click on these actions to view more details about them, such as the action object that was dispatched, the effects or the state difference, and whole state of the application after the dispatch. The time slider panel allows you to rewind, fast forward, and play through all recorded actions.

### The UI
|Property  | Description |
| ------------- | ------------- |
| Events  |  Dispatched actions (three ways to view see below)  <br/>Shows elapsed time since last dispatch |
|Actions  | Events action type and payload  |
|Effects  | Difference between selected event and previous state  |
|State  | Overall state of the application at the selected time  |
## Contributing

Please fork this repo.  We welcome pull requests. For suggestions or to report bugs please log an issue.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

[Brandon Murphy](https://github.com/murphybrandon) | [Victor Varaschin](https://github.com/victorvrv) | [Kia Colbert](https://github.com/kiacolbert) | [Gabor Mowiena](https://github.com/GaberMowiena)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details

