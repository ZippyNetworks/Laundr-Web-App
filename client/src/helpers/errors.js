//todo: move this to a dialog, maybe in layout, for components that dont use their own error dialog (such as new order)
export const showDefaultError = (task, code) => {
  alert(
    `Error with ${task}. Please try again later. If this problem continues, contact us. Error code: ${code}`
  );
};

export const showConsoleError = (task, error) => {
  console.warn(`Error with ${task}: ${error}`);
};
