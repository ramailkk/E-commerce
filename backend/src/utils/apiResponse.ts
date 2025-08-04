export function ApiResponse(data = {}, message = "", status = false) {
  return { status, message, data };
}
