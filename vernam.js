const GEORGIAN_ALPHABET = "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ";
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

function getGeorgianIndex(char = "") {
  const index = GEORGIAN_ALPHABET.indexOf(char);
  if (index === -1) {
    throw new Error(`Character "${char}" is not in the Georgian alphabet`);
  }
  return index;
}

function getGeorgianChar(index = -1) {
  const length = GEORGIAN_ALPHABET.length;
  if (index < 0 || index >= length) {
    throw new Error(
      `Index ${index} is out of bounds for the Georgian alphabet`
    );
  }
  return GEORGIAN_ALPHABET[index];
}

function vernamEncrypt(text = "", key = "") {
  if (typeof text !== "string" || typeof key !== "string") {
    throw new Error("Both text and key must be strings");
  }

  if (text.length !== key.length) {
    throw new Error("Text and key must be of the same length");
  }

  const length = GEORGIAN_ALPHABET.length;
  let encryptedText = "";

  for (let i = 0; i < text.length; i++) {
    const textIndex = getGeorgianIndex(text[i]);
    const keyIndex = getGeorgianIndex(key[i]);

    const encryptedIndex = (textIndex ^ keyIndex) % length;

    encryptedText += getGeorgianChar(encryptedIndex);
  }

  return encryptedText;
}

function vernamDecrypt(encryptedText = "", key = "") {
  return vernamEncrypt(encryptedText, key);
}

function main() {
  TEST_CASES.forEach(({ text, key }) => {
    try {
      console.log(`Original: ${text}`);
      console.log(`Key: ${key}`);
      const encryptedText = vernamEncrypt(text, key);
      console.log(`Encrypted: ${encryptedText}`);

      const decryptedText = vernamDecrypt(encryptedText, key);
      console.log(`Decrypted: ${decryptedText}`);

      if (decryptedText !== text) {
        throw new Error(
          "Decryption failed: decrypted text does not match original"
        );
      }

      console.log(`Decryption successful, encryption matches decryption.\n`);
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }
  });
}

main();
