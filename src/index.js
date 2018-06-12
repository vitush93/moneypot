import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ipfs from './core/ipfs';

// generate key pair
// const keypair = require('keypair');

// const pair = keypair();
// console.log(pair);setInterval(() => {
    //   ipfs.swarm.peers((err, peers) => {
    //     this.setState({
    //       peerCount: peers.length
    //     });
    //   });
    // }, 1000);

// TODO display some loading here
ipfs.on('ready', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});

registerServiceWorker();