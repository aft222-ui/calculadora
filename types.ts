
// Declares the mathjs library loaded from a CDN as a global variable.
// This allows TypeScript to recognize the 'math' object without needing an import.
declare const math: {
  evaluate: (expr: string) => number;
};
