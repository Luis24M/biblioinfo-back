export function successResponse(message: string, data: any = null, status = 200) {
  return {
    success: true,
    status,
    message,
    data
  };
}

export function errorResponse(message: string, status = 500, data: any = null) {
  return {
    success: false,
    status,
    message,
    data
  };
}
