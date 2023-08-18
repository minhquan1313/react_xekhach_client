export default async function fetcher(url: string) {
  const res = await fetch(url);
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
export async function fetcherPost(url: string, obj: Object) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const data = await res.json();

  return data;
}
export async function fetcherPatch(url: string, obj: Object) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const data = await res.json();

  return data;
}
export async function fetcherDelete(url: string) {
  const res = await fetch(url, {
    method: "DELETE",
  });
  const data = await res.json();

  return data;
}
