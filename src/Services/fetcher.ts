const API = import.meta.env.VITE_API;
export default async function fetcher(url: string) {
  const res = await fetch(API + url);

  const data = await res.json();

  return data;
}
export function fetcherFake(ms: number) {
  return function (url: string) {
    return new Promise((rs) => {
      setTimeout(() => {
        rs(url);
      }, ms);
    });
  };
}
export const fetcherPost = (obj: object) => async (url: string) => {
  const res = await fetch(API + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  const data = await res.json();

  return data;
};
export const fetcherPatch = (obj: object) => async (url: string) => {
  const res = await fetch(API + url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const data = await res.json();

  return data;
};

export async function fetcherDelete(url: string) {
  const res = await fetch(API + url, {
    method: "DELETE",
  });
  const data = await res.json();

  return data;
}
