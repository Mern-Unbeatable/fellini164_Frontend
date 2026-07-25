/** Dev console helper — filter DevTools with `[Google Auth]`. */
export function logGoogleAuth(step, message, data) {
  const label = `[Google Auth] Step ${step} — ${message}`;
  if (data !== undefined) {
    console.log(label, data);
    return;
  }
  console.log(label);
}

export function logGoogleAuthBody(idToken) {
  const body = { idToken };
  logGoogleAuth(4, 'Backend request body (exact JSON)', body);
  logGoogleAuth(4, 'idToken info', {
    length: idToken?.length ?? 0,
    preview: idToken ? `${idToken.slice(0, 50)}...${idToken.slice(-20)}` : null,
  });
}
