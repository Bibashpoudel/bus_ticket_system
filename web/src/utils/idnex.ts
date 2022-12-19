const languages = ['english', 'amharic', 'oromifa'];

export const findNextLanguage = (currentLanguage: string) => {
  const currentIndex = languages.findIndex((s) => s === currentLanguage);

  if (currentIndex !== -1) {
    if (currentIndex === 2) {
      return languages[0];
    } else {
      return languages[currentIndex + 1];
    }
  }
};
