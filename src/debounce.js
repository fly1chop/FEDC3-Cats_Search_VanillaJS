export default function debounce(func, timeout = 500) {
  let timerId = null;

  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(context, args);
    }, timeout);
  };
}
