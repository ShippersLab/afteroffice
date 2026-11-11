export const hasFlag = (key: string): boolean => {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

export const setFlag = (key: string): void => {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    return;
  }
};
