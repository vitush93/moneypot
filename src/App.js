import React, { Component } from 'react';
import { Form, Container, Grid } from 'semantic-ui-react';


const ipfsOptions = {
  repo: './ipfs1',
  EXPERIMENTAL: {
    pubsub: true
  },
  start: true,
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        "/ip4/127.0.0.1/tcp/4001",
        "/ip4/127.0.0.1/tcp/4001/ws"
      ]
    }
  },
};

// Create IPFS instance
const ipfs = new window.Ipfs(ipfsOptions);

// Create a database
const orbitdb = new window.OrbitDB(ipfs, './orbitdb1');


class App extends Component {

  constructor(props) {
    super(props);

    this.db = null;

    this.state = {
      inputText: '',
      peerCount: 0,
      items: []
    }
  }

  async componentDidMount() {
    ipfs.on('ready', async () => {
      this.db = await orbitdb.log('xprv9s21ZrQH143K2FL4b2HWwh7P6hiqmeCMJXt33HMw6zjRo56fp7SfmNiXRhUcG8KHHdUwoawYA5LkXiBTZGja6EPyLXHE9bjzdxqVK826vrU', {
        write: ['*'],
        sync: true,
        create: true,
        replicate: true,
        localOnly: false
      });
      await this.db.load();

      this.db.events.on('ready', () => {
        console.log('database is ready!');
      });
      this.db.events.on('synced', () => {
        console.log('database is synced!');
      });
      this.db.events.on('replicated', () => {
        console.log('database replicated!');
      });

      this.db.events.on('replicate', () => {
        console.log('replicating database...');
      });

      this.db.events.on('replicate.progress', (address, hash, entry, progress, have) => {
        console.log(progress);
      });

      let maxTotal = 0, loaded = 0;
      this.db.events.on('load.progress', (address, hash, entry, progress, total) => {
        loaded++;
        maxTotal = Math.max.apply(null, [progress, maxTotal, progress, 0]);
        total = Math.max.apply(null, [progress, maxTotal, total, 0]);

        console.log(`Loading database... ${maxTotal} / ${total}`);
      });

      setInterval(() => {
        ipfs.swarm.peers((err, peers) => {
          this.setState({
            peerCount: peers.length
          });
        });
      }, 1000);

      setInterval(() => {  
        const latest = this.db.iterator({ limit: 5 }).collect();
        console.log(latest);
        
        this.setState({
          items: latest
        });
        
      }, 1000)
    });

  }

  inputBoxChanged(e) {
    let val = e.target.value

    this.setState({
      inputText: val
    });
  }

  addButtonClicked(e) {

    // send to OrbitDB
    this.db.add({
      text: this.state.inputText
    }).then(hash => {
      console.log('stored hash: ' + hash);
    });
  }

  render() {
    return (
      <Container>
        <Grid columns={1}>
          <Grid.Row>

            <Grid.Column>
              <p>Connected peers: {this.state.peerCount}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <br />
              <br />
              <Form>
                <Form.Field>
                  <Form.Input label='' value={this.state.inputText} onChange={this.inputBoxChanged.bind(this)} />
                </Form.Field>
                <Form.Button onClick={this.addButtonClicked.bind(this)}>Add</Form.Button>
              </Form>
            </Grid.Column>
            <Grid.Column />
          </Grid.Row>
        </Grid>
        <Grid columns={1}>
          <Grid.Row>

            <Grid.Column>
              {this.state.items.map(item => {
                return <p key={item.hash}><strong>{item.payload.value.name}</strong> {item.payload.value.amount}</p>
              })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    );
  }
}

export default App;
