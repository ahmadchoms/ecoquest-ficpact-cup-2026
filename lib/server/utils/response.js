import { NextResponse } from "next/server";

/**
 * Standardized API Response Utilities
 * Ensures every endpoint returns a predictable shape.
 */

// --- Success Responses ---

export function successResponse(data, meta = null, status = 200) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function createdResponse(data) {
  return successResponse(data, null, 201);
}

// --- Error Responses ---

export function errorResponse(message, status = 500, details = null) {
  const body = { success: false, error: message };
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

export function validationErrorResponse(zodError) {
  const formatted = zodError.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
  return errorResponse("Validation failed", 400, formatted);
}

export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} tidak ditemukan.`, 404);
}

export function unauthorizedResponse(message = "Unauthorized: Akses ditolak.") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden: Anda tidak memiliki izin.") {
  return errorResponse(message, 403);
}

export function conflictResponse(message = "Data sudah ada.") {
  return errorResponse(message, 409);
}

export function serverErrorResponse(message = "Terjadi kesalahan internal server.") {
  return errorResponse(message, 500);
}
