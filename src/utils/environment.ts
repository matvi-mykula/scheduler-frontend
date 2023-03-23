const devBackend = 'http://localhost:3001';
let prodBackend;

export const serverPath =
  process.env.NODE_ENV === 'production' ? prodBackend : devBackend;
