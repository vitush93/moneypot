import React, { Component } from 'react';
import { Form, Container, Grid } from 'semantic-ui-react';
import eventlog from './core/eventlog';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      inputText: '',
      peerCount: 0,
      items: []
    }
  }

  async componentDidMount() {
    this.db = await eventlog(this.setupEvents.bind(this));
  }

  updateItems(db) {
    const latest = db.iterator({ limit: -1 }).collect();
    console.log(latest);

    this.setState({
      items: latest
    });
  }

  setupEvents(db) {
    const updateItemsWrapper = () => {
      this.updateItems(db)
    }
    db.events.on('ready', updateItemsWrapper);
    db.events.on('replicated', updateItemsWrapper);
    db.events.on('write', updateItemsWrapper);

    db.events.on('replicate', () => {
      console.log('replicating database...');
    });
  }

  inputBoxChanged(e) {
    let val = e.target.value

    this.setState({
      inputText: val
    });
  }

  addButtonClicked(e) {
    this.db.add({
      text: this.state.inputText
    }).then((hash) => {
      console.log('stored hash: ' + hash);
      this.setState({
        inputText: ''
      });
    });
  }

  render() {
    return (
      <Container>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <Form.Input label='' value={this.state.inputText} onChange={this.inputBoxChanged.bind(this)} />
                </Form.Field>
                <Form.Button onClick={this.addButtonClicked.bind(this)}>Add</Form.Button>
              </Form>
            </Grid.Column>
            <Grid.Column>
              {this.state.items.map(item => {
                return <p key={item.hash}>{item.payload.value.text}</p>
              })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;
