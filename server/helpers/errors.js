const showConsoleError = (task, error) => {
  console.log(`Error with ${task}: ${error}`);
};

const caughtError = (task) => {
  return `Error with ${task}. Please contact us.`;
};

module.exports = { showConsoleError, caughtError };
