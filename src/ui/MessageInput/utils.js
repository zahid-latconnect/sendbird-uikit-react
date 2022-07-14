// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  let timeout;
  return function _debounce() {
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const isSlashCommand = (message) => {
  return (message.indexOf("/") > -1);
}

export const parseSlashCommand = (message) => {
  const splitMessage = message.split(" ");
  const command = splitMessage[0];
  const input = splitMessage[1];
  // iterate through manifest to find url for this command

  // const url = getUrlForCommand(command)
  const url = "http://localhost:8283/command"
  return [url, input]
}

export default debounce;
