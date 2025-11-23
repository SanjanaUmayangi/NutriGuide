// lib/api/authApi.ts
export async function loginApi(email: string, password: string) {
  // mock: accept any
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: 'fake-token', username: email.split('@')[0] }), 700);
  });
}



// // authService.js
// export async function dummyLogin(username, password) {
//   const res = await fetch('https://dummyjson.com/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
//   if (!res.ok) throw new Error('Login failed: ' + res.status);
//   const data = await res.json(); // contains token, user info in dummyjson
//   return data;
// }

// // Example: dummyLogin('kminchelle','0lelplR')  // check DummyJSON docs for sample creds
