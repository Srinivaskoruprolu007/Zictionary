import * as React from "react"

// Define the breakpoint for mobile devices (Tailwind's `md` breakpoint is 768px)
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to determine if the current screen width is considered mobile.
 * @returns {boolean} `true` if the screen width is less than the mobile breakpoint, `false` otherwise. Returns `false` during server-side rendering.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Default to false SSR

  React.useEffect(() => {
    // Ensure window is defined (client-side)
    if (typeof window === 'undefined') {
      return;
    }

    const checkDevice = () => {
      // Check window existence again inside the handler, just in case
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };

    // Initial check
    checkDevice();

    // Add resize listener
    window.addEventListener('resize', checkDevice);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkDevice);
  }, []); // Empty dependency array ensures this runs only once on mount client-side

  return isMobile;
}
