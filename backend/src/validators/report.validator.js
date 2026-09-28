const reportFields = [
  'assetId',
  'symptom',
  'diagnosis',
  'action',
  'partsUsed',
  'outcome',
  'technicianNotes',
];

export function validateReport(input) {
  const errors = [];

  for (const field of reportFields) {
    if (typeof input?.[field] !== 'string' || input[field].trim() === '') {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  }

  if (errors.length > 0) {
    const error = new Error('Invalid maintenance report');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  return Object.fromEntries(reportFields.map((field) => [field, input[field].trim()]));
}