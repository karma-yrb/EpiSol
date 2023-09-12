const isTokenValidMiddleware = (): boolean => {
  const tokenExpTimestamp = Number(localStorage.getItem('tokenExpTimestamp'));

  const dateNow = new Date();
  const dateExp = new Date(tokenExpTimestamp);

  return dateExp.getTime() > dateNow.getTime();
};

export default isTokenValidMiddleware;
