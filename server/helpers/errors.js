const showConsoleError = (task, error) => {
  console.log(`Error with ${task}: ${error}`);
};

const caughtError = (task) => {
  return `Error with ${task}. Please try again. If this issue continues, contact us.`;
};

module.exports = { showConsoleError, caughtError };
