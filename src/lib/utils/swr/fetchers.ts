export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const postFetcher = async ([url, body]: [string, unknown]) => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.json();
};
