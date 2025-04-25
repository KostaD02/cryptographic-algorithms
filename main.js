const vernamForm = document.querySelector("form#vernam");
const vernamResult = document.querySelector("div#vernamResult");

const frequencyForm = document.querySelector("form#frequency");
const frequencyCharResult = document.querySelector(
  "table#frequencyCharResult > tbody"
);
const frequencyBigramResult = document.querySelector(
  "table#frequencyBigramResult > tbody"
);
const frequencyGuessesControl = document.querySelector(
  "form#frequencyGuessesControl"
);
const frequencyGuessesResult = document.querySelector(
  "div#frequencyGuessesResult"
);
const frequencyGuessesResultError = document.querySelector(
  "div#frequencyGuessesResultError"
);
const frequencyGuessesReset = document.querySelector(
  "span#frequencyGuessesReset"
);

const georgianAlphabet = GEORGIAN_ALPHABET.alphabet.split("");

vernamForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(vernamForm);
  const text = formData.get("text") || "";
  const key = formData.get("key") || "";

  try {
    const encryptedText = vernamEncrypt(text, key);
    const decryptedText = vernamDecrypt(encryptedText, key);
    vernamResult.innerHTML = `
    <ul class="m-0">
      <li>Original: ${text}</li>
      <li>Key: ${key}</li>
      <li>Encrypted: ${encryptedText}</li>
      <li>Decrypted: ${decryptedText}</li>
    </ul>
    `;
  } catch (error) {
    vernamResult.innerHTML = `<p class="m-0" style="color: red;">Error: ${error.message}</p>`;
  }
});

frequencyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(frequencyForm);
  const text = formData.get("text") || "";

  try {
    const result = frequencyAnalyze(text);
    const { characterFrequencies, topBigrams } = result;
    frequencyCharResult.innerHTML = characterFrequencies
      .map((item, index) => {
        return `
    <tr>
      <th scope="row">${index + 1}</th>
      <td>${item.ch}</td>
      <td>${item.cnt}</td>
      <td>${item.freq}</td>
    </tr>`;
      })
      .join("");
    frequencyBigramResult.innerHTML = topBigrams
      .map((item, index) => {
        return `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${item.bg}</td>
        <td>${item.cnt}</td>
        <td>${item.freq}</td>
      </tr>`;
      })
      .join("");
    buildFrequencyGuessUI(text, characterFrequencies);
    adjustFrequencyGuessError(false);
  } catch (error) {
    frequencyCharResult.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
    frequencyBigramResult.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
    adjustFrequencyGuessError(false);
  }
});

frequencyGuessesControl.addEventListener("change", (event) => {
  event.preventDefault();
  const target = event.target;
  const originalChar = target.getAttribute("data-char");
  const guessedChar = target.value;

  if (guessedChar.length === 0) {
    adjustFrequencyGuessError(false);
    target.value = "";
    const originalChars = document.querySelectorAll(
      `span[data-original-char='${originalChar}']`
    );
    originalChars.forEach((item) => {
      item.innerText = originalChar;
      item.removeAttribute("data-modified");
      item.removeAttribute("data-new-char");
      item.classList.remove("fw-bold");
    });
    return;
  }

  try {
    GEORGIAN_ALPHABET.getIndex(guessedChar);
  } catch (error) {
    target.value = "";
    adjustFrequencyGuessError(
      true,
      `"${guessedChar}" is not a valid Georgian character`
    );
    return;
  }

  if (originalChar === guessedChar) {
    adjustFrequencyGuessError(
      true,
      `"${guessedChar}" is the same as guess character, nothing changes`
    );
    target.value = "";
    return;
  }

  if (document.querySelector(`span[data-new-char='${guessedChar}']`)) {
    adjustFrequencyGuessError(
      true,
      `"${guessedChar}" is already used in the text`
    );
    target.value = "";
    return;
  }

  const changedChars = document.querySelectorAll(
    `span[data-original-char='${originalChar}']`
  );

  if (changedChars.length === 0) {
    adjustFrequencyGuessError(
      true,
      `"${guessedChar}" is not a valid character in the text`
    );
    target.value = "";
    return;
  }

  changedChars.forEach((item) => {
    item.innerText = guessedChar;
    item.setAttribute("data-modified", true);
    item.setAttribute("data-new-char", guessedChar);
    item.classList.add("fw-bold");
  });

  adjustFrequencyGuessError(false);
});

frequencyGuessesReset.addEventListener("click", () => {
  const chars = document.querySelectorAll("span[data-original-char]");

  if (chars.length === 0) {
    adjustFrequencyGuessError(true, "Nothing to reset, first add text");
    return;
  }

  const changedChars = document.querySelectorAll("span[data-new-char]");

  if (changedChars.length === 0) {
    adjustFrequencyGuessError(true, "Nothing to reset, first add guesses");
    return;
  }

  changedChars.forEach((item) => {
    const originalChar = item.getAttribute("data-original-char");
    item.innerText = originalChar;
    item.removeAttribute("data-modified");
    item.removeAttribute("data-new-char");
    item.classList.remove("fw-bold");
  });
  const inputs = frequencyGuessesControl.querySelectorAll("input");
  inputs.forEach((item) => {
    item.value = "";
  });
  adjustFrequencyGuessError(false);
});

function buildFrequencyGuessUI(text = "", characterFrequencies = []) {
  frequencyGuessesControl.innerHTML = "";
  const sortedFrequencies = characterFrequencies.sort(
    (a, b) => georgianAlphabet.indexOf(a.ch) - georgianAlphabet.indexOf(b.ch)
  );

  const fragment = document.createDocumentFragment();

  sortedFrequencies.forEach((item) => {
    const div = document.createElement("div");
    div.style.maxWidth = "40px";
    div.classList.add("text-center");
    const label = document.createElement("label");
    label.classList.add("form-label");
    label.setAttribute("for", `guess-${item.ch}`);
    label.innerText = item.ch;
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", `guess-${item.ch}`);
    input.setAttribute("name", `guess-${item.ch}`);
    input.setAttribute("maxlength", 1);
    input.setAttribute("autocomplete", "off");
    input.setAttribute("data-char", item.ch);
    input.classList.add("form-control");
    div.appendChild(label);
    div.appendChild(input);
    fragment.appendChild(div);
  });

  frequencyGuessesControl.appendChild(fragment);
  frequencyGuessesResult.innerHTML = text
    .split("")
    .map((char) => `<span data-original-char="${char}">${char}</span>`)
    .join("");
}

function adjustFrequencyGuessError(isError = false, text = "") {
  if (isError) {
    frequencyGuessesResultError.innerHTML = text;
    frequencyGuessesResultError.classList.remove("d-none");
  } else {
    frequencyGuessesResultError.innerHTML = "";
    frequencyGuessesResultError.classList.add("d-none");
  }
}
