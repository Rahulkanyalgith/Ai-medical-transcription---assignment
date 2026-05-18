import { medicalDictionary } from "../utils/medicalDictionary.js";

export function correctMedicalTerms(text) {

  let correctedText = text;

  for (const wrongWord in medicalDictionary) {

    const correctWord = medicalDictionary[wrongWord];

    const regex = new RegExp(wrongWord, "gi");

    correctedText = correctedText.replace(regex, correctWord);
  }

  return correctedText;
}