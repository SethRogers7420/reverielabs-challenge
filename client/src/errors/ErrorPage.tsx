import { FC } from "react";
import { getEnvVariable } from "../environment-variables/getEnvVariable";

type ErrorPageProps = {
  error: unknown;
};

/** A very simple error page that displays the error information in local dev and a generic message in production. */
export const ErrorPage: FC<ErrorPageProps> = (props) => {
  const { error } = props;

  if (getEnvVariable("NODE_ENV") === "development") {
    return (
      <>
        <div>An error ocurred.</div>
        {isErrorObject(error) && <div>{error.toString()}</div>}
      </>
    );
  } else {
    return <div>An error ocurred.</div>;
  }
};

/** Custom type guard to check if an error is an object that we can stringify in local dev. */
function isErrorObject(error: unknown): error is { toString: () => string } {
  return !!(error as Error).toString;
}
