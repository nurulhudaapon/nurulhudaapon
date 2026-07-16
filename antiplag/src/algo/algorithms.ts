

  export function convertToSlug(sentence: string) {
    const validChars = "abcdefghijklmnopqrstuvwxyz0123456789-";
    let slug = "";
  
    for (let i = 0; i < sentence.length; i++) {
      const char = sentence[i].toLowerCase();
  
      if (validChars.includes(char)) {
        // Include valid characters in the slug
        slug += char;
      } else if (char === " ") {
        // Replace spaces with hyphens
        slug += "-";
      }
      // Ignore other special characters
    }
  
    return slug;
  }
  
  const DES_ALGO = {
   }


export function generateAlgorithmDescription(algorithm: string) {
  let bestMatch = '';
  let bestMatchScore = 0;

  for (const key in DES_ALGO) {
    const score = stringSimilarityScore(algorithm + '', key + ' ' + DES_ALGO[key as keyof typeof DES_ALGO])
    if (score > bestMatchScore) {
      bestMatch = key;
      bestMatchScore = score;
    }
  }

  return DES_ALGO[bestMatch as keyof typeof DES_ALGO];
}

function stringSimilarityScore(a: string, b: string) {
  const aWords = a?.split(' ').flatMap((word) => word.split('-'));
  const bWords = b?.split(' ').flatMap((word) => word.split('-'));
  let score = 0;

  for (const aWord of aWords) {
    for (const bWord of bWords) {
      if (bWord.toLowerCase() === aWord.toLowerCase()) {
        score++;
      }
    }
  }

  return score;
}

export function hashPassword(str: string) {
  let hash = 3344; // Initial hash value

  for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
  }

  return hash >>> 0;
}
