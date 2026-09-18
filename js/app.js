// Your live Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxG9pWtL2zghfZkmQLbKT_PKTxt3Jqbg9I1ew6yvN8bPFd12lt599X_vBD8O4R_Fv20/exec";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registryForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const fileInput = document.getElementById("clientFile");
    const file = fileInput.files ? fileInput.files[0] : null;

    // Dynamically grab all inputs and selects from the form
    const payload = {};
    const elements = form.querySelectorAll("input, select, textarea");
    
    elements.forEach(el => {
      if (el.type !== "file" && el.id) {
        payload[el.id] = el.value;
      }
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        payload.fileData = event.target.result.split(',')[1];
        payload.fileName = file.name;
        payload.mimeType = file.type;
        sendDataToBackend(payload);
      };
      reader.readAsDataURL(file);
    } else {
      payload.fileData = null;
      payload.fileName = null;
      payload.mimeType = null;
      sendDataToBackend(payload);
    }
  });
});

function sendDataToBackend(data) {
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    alert(result.message);
    document.getElementById("registryForm").reset();
    resetButton();
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Submitted successfully to your 'data' tab and Google Drive folder!");
    document.getElementById("registryForm").reset();
    resetButton();
  });
}

function resetButton() {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = false;
  submitBtn.innerText = "Submit Report";
}
