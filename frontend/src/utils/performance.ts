/**
 * Performance utilities for React applications
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * Throttle function to limit the rate at which a function is executed
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = <T extends any[]>(fn: Function, limit: number) => {
  let inThrottle = false;
  return (...args: T) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Lazy loads an image and returns a promise
 * @param {string} src - Image source URL
 * @returns {Promise} Promise that resolves when the image is loaded
 */
export const lazyLoadImage = (src: any) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

/**
 * Checks if the browser supports the Intersection Observer API
 * @returns {boolean} Whether the browser supports Intersection Observer
 */
export const supportsIntersectionObserver = () => {
  return "IntersectionObserver" in window;
};
