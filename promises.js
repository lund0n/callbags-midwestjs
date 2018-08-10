const greeting = new Promise(resolve => {
  setTimeout(() => {
    resolve("hello");
  }, 1000);
});
greeting.then(message => {
  console.log("The message is:", message);
});
