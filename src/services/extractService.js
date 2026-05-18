const medicalConditions = [
  "diabetes",
  "hypertension",
  "asthma",
  "arthritis",
];

export function extractConditions(text) {

  const found = [];

  medicalConditions.forEach((condition) => {

    if (text.toLowerCase().includes(condition)) {
      found.push(condition);
    }
  });

  return found;
}