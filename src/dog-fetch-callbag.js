const dogFetch = breed =>
  fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then(resp => resp.json())
    .then(({ message }) => message);

const dogFetchCallbag = initialBreed => source => (start, sink) => {
  // If type is not 'start', just ignore the request,
  // since the producer returns a new callback for future communication.
  if (start !== 0) {
    return;
  }
  let breed = initialBreed;
  // Connect to source.
  source(0, (t, d) => {
    if (t === 0) {
      // Hold on to talkback so we can unsubscribe.
      const talkback = d;
      // Respond to sink, providing a callback to communicate with this operator.
      sink(0, (st, sd) => {
        // Ignore extra connect calls from sink (should never happen)
        if (st === 0) {
          return;
        } else if (st === 1) {
          // The consumer has sent us new data (a new breed).
          // - Change the breed
          // - Fetch an image with the new breed.
          // - Respond to the sink with data (the new image)
          breed = sd;
          dogFetch(breed).then(imgSrc => sink(1, imgSrc));
        } else if (st === 2) {
          // The consumer has told us to stop.
          // - Tell the source to stop.
          talkback(2);
        }
      });
    } else if (t === 1) {
      // We have received data from the source.
      // - Fetch an image with the current breed.
      // - Respond to the sink with data (the new image)
      dogFetch(breed).then(imgSrc => sink(1, imgSrc));
    } else if (t === 2) {
      // Source is done.
      // - Tell the sink.
      sink(2, d);
    }
  });
};

export default dogFetchCallbag;
