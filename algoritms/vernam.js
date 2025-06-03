const GEORGIAN_ALPHABET = {
  alphabet: "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ",

  getIndex(char = "") {
    const index = this.alphabet.indexOf(char);
    if (index === -1) {
      throw new Error(`Character "${char}" is not in the Georgian alphabet`);
    }
    return index;
  },

  getChar(index = -1) {
    if (index < 0 || index >= this.alphabet.length) {
      throw new Error(
        `Index ${index} is out of bounds for the Georgian alphabet`
      );
    }
    return this.alphabet[index];
  },
};

const TEST_CASES = [
  {
    text: "გამარჯობა",
    key: "საიდუმლოო",
  },
  {
    text: "ტესტი",
    key: "რაიმე",
  },
];

function vernamEncrypt(
  text = "",
  key = "",
  georgianAlphabet = GEORGIAN_ALPHABET
) {
  if (typeof text !== "string" || typeof key !== "string") {
    throw new Error("Both text and key must be strings");
  }

  if (text.length === 0 || key.length === 0) {
    throw new Error("Text and key cannot be empty");
  }

  if (text.length !== key.length) {
    throw new Error("Text and key must be of the same length");
  }

  const length = georgianAlphabet.alphabet.length;
  let encryptedText = "";

  for (let i = 0; i < text.length; i++) {
    const textIndex = georgianAlphabet.getIndex(text[i]);
    const keyIndex = georgianAlphabet.getIndex(key[i]);

    const encryptedIndex = (textIndex ^ keyIndex) % length;

    encryptedText += georgianAlphabet.getChar(encryptedIndex);
  }

  return encryptedText;
}

function vernamDecrypt(
  encryptedText = "",
  key = "",
  georgianAlphabet = GEORGIAN_ALPHABET
) {
  return vernamEncrypt(encryptedText, key, georgianAlphabet);
}

function vernamMain(cases = TEST_CASES) {
  console.log("==================================================");
  if (cases.length === 0) {
    console.warn("No test cases provided");
    return;
  }
  console.info(`Vernam Cipher Test Cases (${cases.length} test)\n`);
  cases.forEach(({ text, key }) => {
    try {
      console.info(`Original: ${text}`);
      console.info(`Key: ${key}`);
      const encryptedText = vernamEncrypt(text, key);
      console.info(`Encrypted: ${encryptedText}`);

      const decryptedText = vernamDecrypt(encryptedText, key);
      console.info(`Decrypted: ${decryptedText}`);

      if (decryptedText !== text) {
        throw new Error(
          "Decryption failed: decrypted text does not match original"
        );
      }

      console.info(`Decryption successful, encryption matches decryption.\n`);
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }
  });
}

vernamMain(TEST_CASES);
