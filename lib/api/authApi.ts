// lib/api/authApi.ts
export async function loginApi(email: string, password: string) {
  // mock: accept any
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: 'fake-token', username: email.split('@')[0] }), 700);
  });
}
