const caughtError = (task, error, code) => {
  return `Error with ${task}: ${error}. Please contact us or try again later. Error code: ${code}`;
};

const showConsoleError = (task, error) => {
  console.warn(`Server: Error with ${task}: ${error}`);
};

module.exports = { showConsoleError, caughtError };
