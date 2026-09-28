function notImplemented(method) {
  const error = new Error(`Groq service method '${method}' is not implemented`);
  error.statusCode = 501;
  return error;
}

export async function generateMaintenanceBrief(context) {
  void context;
  throw notImplemented('generateMaintenanceBrief');
}