import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { GroqService } = require('../../services/groq/groqService.js');
let groqService;

function getGroqService() {
  groqService ??= new GroqService();
  return groqService;
}

function serviceError(cause) {
  const error = new Error('Groq service unavailable', { cause });
  error.statusCode = 502;
  error.code = 'GROQ_UNAVAILABLE';
  return error;
}

export async function generateMaintenanceBrief(context) {
  try {
    return await getGroqService().generateMaintenanceBrief(context);
  } catch (cause) {
    throw serviceError(cause);
  }
}