const showConsoleError = (task, error) => {
  console.error(`Error with ${task}: ${error}`);
};

const caughtError = (task) => {
  return `Error with ${task}. Please contact us.`;
};

module.exports = { showConsoleError, caughtError };
