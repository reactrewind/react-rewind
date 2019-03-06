export default [
  {
    id: 1234,
    action: { type: 'INIT', payload: '' },
    state: {
      totalMarkets: 0,
      totalCards: 0,
      marketList: [],
      lastMarketId: 10000,
      newLocation: ''
    }
  },
  {
    id: 1235,
    action: { type: 'SET_NEW_LOCATION', payload: 'nyc' },
    state: {
      totalMarkets: 0,
      totalCards: 0,
      marketList: [],
      lastMarketId: 10000,
      newLocation: 'nyc',
    },
  },
  {
    id: 1236,
    action: { type: 'ADD_MARKET', payload: 'nyc' },
    state: {
      totalMarkets: 1,
      totalCards: 0,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001
        },
      ],
      lastMarketId: 10001,
      newLocation: '',
    },
  },
  {
    id: 1237,
    action: { type: 'SET_NEW_LOCATION', payload: 'la' },
    payload: 'la',
    state: {
      totalMarkets: 1,
      totalCards: 0,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001,
        },
      ],
      lastMarketId: 10001,
      newLocation: 'la',
    },
  },
  {
    id: 1238,
    action: { type: 'ADD_MARKET', payload: 'boston' },
    state: {
      totalMarkets: 2,
      totalCards: 0,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001
        },
        {
          location: 'la',
          cards: 0,
          marketId: 10002
        }
      ],
      lastMarketId: 10002,
      newLocation: ''
    }
  },
  {
    id: 1239,
    action: { type: 'ADD_CARD', payload: 'marketId: 10002' },
    state: {
      totalMarkets: 2,
      totalCards: 1,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001
        },
        {
          location: 'la',
          cards: 1,
          marketId: 10002
        }
      ],
      lastMarketId: 10002,
      newLocation: ''
    }
  },
  {
    id: 1240,
    action: { type: 'ADD_CARD', payload: 'marketId: 10002' },
    state: {
      totalMarkets: 2,
      totalCards: 2,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001
        },
        {
          location: 'la',
          cards: 2,
          marketId: 10002
        }
      ],
      lastMarketId: 10002,
      newLocation: ''
    }
  },
  {
    id: 1249,
    action: { type: 'ADD_CARD', payload: 'marketId: 10003' },
    state: {
      totalMarkets: 2,
      totalCards: 2,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001
        },
        {
          location: 'la',
          cards: 2,
          marketId: 10002
        },
        {
          location: 'boston',
          cards: 2,
          marketId: 10002
        }
      ],
      lastMarketId: 10002,
      newLocation: ''
    }
  },
  {
    id: 1241,
    action: { type: 'DELETE_CARD', payload: 'marketId: 10002' },
    state: {
      totalMarkets: 2,
      totalCards: 1,
      marketList: [
        {
          location: 'nyc',
          cards: 0,
          marketId: 10001
        },
        {
          location: 'la',
          cards: 1,
          marketId: 10002
        }
      ],
      lastMarketId: 10002,
      newLocation: ''
    }
  }
];