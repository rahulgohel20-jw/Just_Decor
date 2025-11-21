export const translateTextDynamic = async (text, selectedLang, TranslateHindi, TranslateGujarati) => {
  if (!text) return "";

  if (selectedLang === "en") return text;

  try {
    let response;

    if (selectedLang === "hi") {
      response = await TranslateHindi({ text });
    } else if (selectedLang === "gu") {
      response = await TranslateGujarati({ text });
    }

    return (
      response?.data?.text ||
      response?.data?.translatedText ||
      response?.translatedText ||
      response?.data?.translated_text ||
      response?.translated_text ||
      text
    );
  } catch (e) {
    return text;
  }
};
