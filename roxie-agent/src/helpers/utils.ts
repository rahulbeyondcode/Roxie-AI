export const generateRandomString = () =>
  `${window.btoa(Math.random().toString()).substring(10, 15)}`;
