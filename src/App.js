import React, { Component } from "react";
import startWith from "callbag-start-with";
const { interval, pipe, concat } = require("callbag-basics");
const merge = require("callbag-merge");

const dogFetch = breed =>
  fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then(resp => resp.json())
    .then(({ message }) => message);

const dogFetchCallbag = initialBreed => source => (start, sink) => {
  if (start !== 0) {
    return;
  }
  let breed = initialBreed;
  source(0, (t, d) => {
    if (t === 0 || t === 2) {
      sink(t, d);
    } else if (t === 1) {
      dogFetch(breed).then(imgSrc => sink(1, imgSrc));
    }
  });
};

class App extends Component {
  state = {
    imgSrc: null,
    breed: "akita"
  };
  componentDidMount() {
    const source = pipe(
      interval(10000),
      startWith(1),
      dogFetchCallbag(this.state.breed)
    );
    source(0, (t, d) => {
      if (t === 0) {
        this.talkback = d;
      } else if (t === 1) {
        this.setState({ imgSrc: d });
      }
    });
  }
  componentWillUnmount() {
    this.talkback(2);
  }
  handleBreedChange = e => {
    this.setState({ breed: e.target.value });
  };

  render() {
    const { breed, imgSrc } = this.state;
    return (
      <div>
        <h1>Dog Photos</h1>
        <div>
          <form>
            <label>
              Pick your favorite flavor:
              <select value={breed} onChange={this.handleBreedChange}>
                <option value="akita">Akita</option>
                <option value="boxer">Boxer</option>
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
