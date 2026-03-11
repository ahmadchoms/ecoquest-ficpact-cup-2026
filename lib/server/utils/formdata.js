/**
 * Parses FormData and separates files from text fields.
 * Uses a robust, environment-agnostic method to detect File/Blob objects.
 *
 * @param {FormData} formData - The FormData object from the request
 * @returns {Object} { fields, files }
 */
export function parseFormData(formData) {
  const fields = {};
  const files = {};

  for (const [key, value] of formData.entries()) {
    // Robust check: a File/Blob has a `size` property and is not a plain string.
    // This works across different Node.js versions and Next.js environments.
    const isFile =
      value !== null &&
      typeof value === "object" &&
      (typeof value.size === "number" || typeof value.arrayBuffer === "function");

    if (isFile) {
      // Only treat as a real file if it has actual content (name !== empty string)
      if (value.name !== undefined && value.name !== "") {
        files[key] = value;
      } else {
        // Empty file input — treat as missing value, skip
      }
    } else {
      // Coerce string primitives back to their true types
      if (value === "null") fields[key] = null;
      else if (value === "undefined") fields[key] = undefined;
      else if (value === "true") fields[key] = true;
      else if (value === "false") fields[key] = false;
      else fields[key] = value;
    }
  }

  return { fields, files };
}
