function currentEnv() {
  console.log(window.location);
  console.log(process.env.NODE_ENV);
  const devBackend = 'http://localhost:3001/';
  const prodBackend = 'https://dry-silence-9236.fly.dev/';

  console.log({ prodBackend });
  const prodEnv = process.env.NODE_ENV === 'production';
  console.log(prodEnv);
  let environment;
  prodEnv ? (environment = prodBackend) : (environment = devBackend);
  return environment;
}

export default currentEnv;
