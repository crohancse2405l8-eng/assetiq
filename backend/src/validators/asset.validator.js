const assetIdPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export function validateAssetId(value) {
  if (typeof value !== 'string' || !assetIdPattern.test(value)) {
    const error = new Error('Invalid asset ID');
    error.statusCode = 400;
    throw error;
  }

  return value;
}