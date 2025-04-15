const vernamForm = document.querySelector("form#vernam");
const vernamResult = document.querySelector("div#vernamResult");

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
