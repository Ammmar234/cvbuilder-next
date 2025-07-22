// Performance utilities for mobile optimization

/**
 * Throttle function calls to limit execution frequency
 * @param func Function to throttle
 * @param delay Delay in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Debounce function calls to delay execution until after a pause
 * @param func Function to debounce
 * @param delay Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Optimized scroll handler with throttling
 * @param handler Scroll event handler
 * @param delay Throttle delay (default: 16ms for 60fps)
 */
export function createThrottledScrollHandler(
  handler: (event: Event) => void,
  delay: number = 16
) {
  return throttle(handler, delay);
}

/**
 * Optimized resize handler with debouncing
 * @param handler Resize event handler
 * @param delay Debounce delay (default: 250ms)
 */
export function createDebouncedResizeHandler(
  handler: (event: Event) => void,
  delay: number = 250
) {
  return debounce(handler, delay);
}

/**
 * Optimized input handler with debouncing for search/filter
 * @param handler Input event handler
 * @param delay Debounce delay (default: 300ms)
 */
export function createDebouncedInputHandler(
  handler: (value: string) => void,
  delay: number = 300
) {
  return debounce(handler, delay);
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device has touch capability
 */
export function hasTouch(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device pixel ratio for responsive images
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Optimize image loading for mobile
 * @param src Image source
 * @param width Desired width
 * @param height Desired height
 */
export function optimizeImageUrl(
  src: string,
  width?: number,
  height?: number
): string {
  if (!src) return src;
  
  // If it's a data URL or external URL, return as is
  if (src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }
  
  // For local images, you could add optimization parameters
  // This is a placeholder for future image optimization
  return src;
}

/**
 * Lazy load images with intersection observer
 * @param imgElement Image element
 * @param src Image source
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string
): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(imgElement);
  } else {
    // Fallback for older browsers
    imgElement.src = src;
  }
} 