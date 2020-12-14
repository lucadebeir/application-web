//encoder et décoder
export function encoder(text) {
  let res = encodeURI(text);
  return encodeURIComponent(res);
}

export function decoder(text) {
  let res = decodeURIComponent(text);
  return decodeURI(res);
}
