import React, { Component } from "react";
import startWith from "callbag-start-with";
import dogFetchCallbag from "./dog-fetch-callbag";
const { interval, pipe } = require("callbag-basics");

class App extends Component {
  state = {
    imgSrc: null,
    breed: "akita"
  };
  componentDidMount() {
    // Creates a stream that fetches an image URL of a dog, starting with the initial breed.
    const source = pipe(
      interval(10000),
      startWith(1),
      dogFetchCallbag(this.state.breed)
    );
    source(0, (t, d) => {
      if (t === 0) {
        // The source has recognized our subscription.
        // Store a reference to the talkback in the component for later use.
        this.talkback = d;
      } else if (t === 1) {
        // We have received data. Update the component.
        this.setState({ imgSrc: d });
      }
    });
  }
  componentWillUnmount() {
    // Tell the source that we're done (unsubscribe).
    this.talkback(2);
  }
  handleBreedChange = e => {
    this.setState({ breed: e.target.value }, () => {
      // Tell the dogFetch source to use the new breed.
      this.talkback(1, this.state.breed);
    });
  };

  render() {
    const { breed, imgSrc } = this.state;
    return (
      <div>
        <h1>Dog Photos</h1>
        <div>
          <form>
            <label>
              Pick your dog breed:
              <select value={breed} onChange={this.handleBreedChange}>
                <option value="akita">Akita</option>
                <option value="boxer">Boxer</option>
                <option value="pug">Pug</option>
                <option value="terrier/yorkshire">Yorkshire Terrier</option>
              </select>
            </label>
          </form>
        </div>
        {imgSrc && <img src={imgSrc} alt="A dog" />}
      </div>
    );
  }
}

export default App;
