import Err from 'err';
import { oc } from 'ts-optchain.macro';

const logger = console;

export default function handleError(error: Err | Error) {
  const err: Err = sanitizeErr(error);
  const statusCode = err.code.toString();
  if (statusCode.length && statusCode[0] === '4') {
    return logger.warn(err.message);
  }
  return logger.error(err.stack);
}

function sanitizeErr(err: Partial<Err>): Err {
  if (err.originalError) err = err.originalError;
  if (err.isJoi) err.code = 400;
  if (err.statusCode) err.code = err.statusCode;
  if (err.output) err.code = oc(err).output.statusCode(oc(err).code(500));
  if (typeof err.code !== 'number') err.code = 500;
  if (!err.code) err.code = 500;
  return err as Err;
}
