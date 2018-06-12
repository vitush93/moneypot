import config from '../config';
import ipfs from './ipfs';

const orbitdb = new window.OrbitDB(ipfs, config.orbitdb.directory, config.orbitdb.options);

export default orbitdb;