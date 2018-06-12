import config from '../config';

// Create IPFS instance
const ipfs = new window.Ipfs(config.ipfs);

export default ipfs;