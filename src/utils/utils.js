export const debounce = (fn, delay) => {
    let timeoutId;

    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay)
    }
  };