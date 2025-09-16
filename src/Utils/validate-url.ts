const isValidURL = (url: string): boolean => {
  if (!url) {
    return false;
  }

  try {
    const urlObject = new URL(url);

    return Boolean(urlObject);
  } catch (error) {
    return false;
  }
};

const validateURL = (url: string) => {
  if (!isValidURL(url)) {
    throw new Error('Invalid URL');
  }

  return url;
};

export { validateURL, isValidURL };
