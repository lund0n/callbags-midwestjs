function producer(type, data) {
  if (type === 0) {
    const talkback = data;
    let count = 1;
    const handle = setInterval(() => {
      talkback(1, count++);
    }, 1000);
    talkback(0, t => {
      if (t === 2) {
        clearInterval(handle);
      }
    });
  }
}

function consumer(type, data) {
  if (type === 0) {
    const talkback = data;
    setTimeout(() => {
      talkback(2);
    }, 5500);
  }
  if (type === 1) {
    console.log("Value", data);
  }
}

producer(0, consumer);
