import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


// generate key pair
// const keypair = require('keypair');

// const pair = keypair();
// console.log(pair);


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();