function notImplemented(method) {
  const error = new Error(`Hindsight service method '${method}' is not implemented`);
  error.statusCode = 501;
  return error;
}

export async function retain(report) {
  void report;
  throw notImplemented('retain');
}

export async function recall(assetId) {
  void assetId;
  throw notImplemented('recall');
}