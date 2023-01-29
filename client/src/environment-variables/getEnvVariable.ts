export type EnvironmentVariables = "REACT_APP_API_URL" | "NODE_ENV";

/**
 * Simple wrapper around process.env to make environment variables strongly typed and to
 * throw an error if an environment variable does not exist.
 */
export function getEnvVariable(envVariableName: EnvironmentVariables): string {
  const variable = process.env[envVariableName];

  if (!variable) {
    throw new Error(
      `Could not find environment variable with name = ${envVariableName}`
    );
  }

  return variable;
}
