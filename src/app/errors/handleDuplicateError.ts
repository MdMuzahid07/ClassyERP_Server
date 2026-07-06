import { type TErrorSources, type TGenericErrorResponse } from '../interface/error';

interface IMongoDuplicateKeyError {
  message: string;
  keyValue?: Record<string, unknown>;
}

const handleDuplicateError = (err: IMongoDuplicateKeyError): TGenericErrorResponse => {
  // Extract value within quotes using regex
  const match = /"([^"]*)"/.exec(err.message);
  const extractedMessage = match?.[1] ?? 'Value';

  const errorSources: TErrorSources = [
    {
      path: Object.keys(err.keyValue ?? {})[0] ?? '',
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 409;

  return {
    statusCode,
    message: 'Duplicate Entry',
    errorSources,
  };
};

export default handleDuplicateError;
