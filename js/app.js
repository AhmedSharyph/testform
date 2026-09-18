const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNSG3Xotzgrb78pCX_PCGHQ8z-s8JpMnU2NMmD3NcuzEtUNe6ocRu2oGZ1So3-pSg/exec";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("travelerForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const payload = {
      formId: "Traveler Vaccine Appointment Request",
      files: []
    };

    // Dynamically grab all inputs, selects, and textareas
    // Tip: Ensure each field has an appropriate 'id' or 'name' (e.g., id="Full Name")
    const elements = form.querySelectorAll("input, select, textarea");
    const filesToProcess = [];

    elements.forEach(el => {
      if (!el.id) return;

      if (el.type === "file") {
        if (el.files[0]) {
          // Get the label text to use as a clean spreadsheet header column name
          const labelEl = document.querySelector(`label[for="${el.id}"]`);
          const labelText = labelEl ? labelEl.innerText.replace(/[:*]/g, "").trim() : el.id;
          
          filesToProcess.push({
            file: el.files[0],
            fieldKey: el.id,
            fieldLabel: labelText
          });
        }
      } else {
        // Use the element's ID as the dynamic spreadsheet column header name
        payload[el.id] = el.value;
      }
    });

    if (filesToProcess.length > 0) {
      processFilesSequentially(filesToProcess, 0, payload, function(finalPayload) {
        sendDataToBackend(finalPayload);
      });
    } else {
      sendDataToBackend(payload);
    }
  });
});

function processFilesSequentially(fileList, index, payload, callback) {
  if (index >= fileList.length) {
    callback(payload);
    return;
  }

  const item = fileList[index];
  const reader = new FileReader();
  
  reader.onload = function (e) {
    payload.files.push({
      fieldKey: item.fieldKey,
      fieldLabel: item.fieldLabel,
      base64: e.target.result,
      name: item.file.name
    });
    processFilesSequentially(fileList, index + 1, payload, callback);
  };
  
  reader.readAsDataURL(item.file);
}

function sendDataToBackend(data) {
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    alert(result.message);
    document.getElementById("travelerForm").reset();
    resetButton();
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Submitted successfully!");
    document.getElementById("travelerForm").reset();
    resetButton();
  });
}

function resetButton() {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = false;
  submitBtn.innerText = "Submit Request";
}
