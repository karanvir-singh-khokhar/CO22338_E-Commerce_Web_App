// // src/utils/useDebounce.js

// import { useEffect, useState } from "react";

// /**
//  * useDebounce - returns a debounced value that updates after a delay
//  * @param {*} value - the input value to debounce
//  * @param {number} delay - debounce delay in milliseconds
//  * @returns {*} debouncedValue
//  */
// function useDebounce(value, delay = 300) {
//     const [debouncedValue, setDebouncedValue] = useState(value);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);

//         return () => {
//             clearTimeout(timer);
//         };
//     }, [value, delay]);

//     return debouncedValue;
// }

// export default useDebounce;
