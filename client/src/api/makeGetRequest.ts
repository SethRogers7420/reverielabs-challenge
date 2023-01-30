type RelativeURL = `/${string}`;

/**
 * Simple wrapper around fetch to make it easier to use GET requests and to provide better TypeScript support.
 *
 * @param relativeUrl - The URL relative to the API, in the format of `/chembl/CHEMBL203`
 */
export async function makeGetRequest<ReturnType>(
  relativeUrl: RelativeURL,
  queryParameters?: Record<string, string>
): Promise<ReturnType> {
  let url = `${process.env.REACT_APP_API_URL}${relativeUrl}`;

  if (queryParameters != null) {
    url += `?${new URLSearchParams(queryParameters)}`;
  }

  const response = await fetch(url, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return response.json();
}
