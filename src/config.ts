const config = {
  api: {port: 3000},
  chatServer: {port: 3001},
  addresses: {
    stake: 'BGJS11XLNLWKZXXQnzEMnmafqFNA7iL5mq',
    payout: 'SB-Payout',
  },
  db: {
    host: 'localhost',
    // host: 'mongo',
    port: '27017',
    name: 'sportsbook',
    user: '',
    pass: '',
  },
  rpc: {
    host: 'http://178.238.231.35',
    port: '5560',
    user: '1x2rpcuser',
    pass: 'VMRfNBB3LbQ8GwFU',
  },
  bet365Api: {
    host: 'https://api.b365api.com',
    token: '51340-Pjzi83E1bjOVEd',
  },
};

export default config;
