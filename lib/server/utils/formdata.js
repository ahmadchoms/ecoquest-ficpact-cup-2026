import { z } from "zod";

/**
 * Parses FormData and separates files from text fields.
 * Performs type coercion based on the provided Zod schema rules.
 * 
 * @param {FormData} formData - The FormData object from the request
 * @param {z.ZodTypeAny} schema - Optional Zod schema for type hinting
 * @returns {Object} { fields, files }
 */
export function parseFormData(formData, schema = null) {
  const fields = {};
  const files = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files[key] = value;
    } else {
      // Type coercion based on schema if provided
      let fieldSchema = schema && schema.shape && schema.shape[key] ? schema.shape[key] : null;

      if (fieldSchema) {
        // Unwrap optional/nullable/default wrappers to find the underlying type
        while (fieldSchema) {
          if (fieldSchema instanceof z.ZodDefault) {
             fieldSchema = fieldSchema._def.innerType;
          } else if (fieldSchema instanceof z.ZodEffects) {
             fieldSchema = fieldSchema.innerType();
          } else if (typeof fieldSchema.unwrap === 'function') {
             fieldSchema = fieldSchema.unwrap();
          } else if (fieldSchema._def && fieldSchema._def.innerType) {
             fieldSchema = fieldSchema._def.innerType;
          } else {
             break; // Can't unwrap further
          }
        }

        if (fieldSchema && fieldSchema instanceof z.ZodNumber) {
          // Coerce to number
          fields[key] = value === "" ? undefined : Number(value);
        } else if (fieldSchema instanceof z.ZodBoolean) {
          // Coerce to boolean ('true' -> true, anything else -> false)
          fields[key] = value === "true" || value === true;
        } else if (fieldSchema instanceof z.ZodDate) {
          // Coerce to Date object
          fields[key] = value ? new Date(value) : undefined;
        } else {
          // Treat as string or fallback
          if (value === "null") fields[key] = null;
          else if (value === "undefined") fields[key] = undefined;
          else fields[key] = value;
        }
      } else {
        // Fallback coercion for boolean strings
        if (value === "true") fields[key] = true;
        else if (value === "false") fields[key] = false;
        else if (value === "null") fields[key] = null;
        else if (value === "undefined") fields[key] = undefined;
        else fields[key] = value;
      }
    }
  }

  return { fields, files };
}
