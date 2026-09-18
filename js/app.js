document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registryForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const fileInput = document.getElementById("clientFile");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64Data = event.target.result.split(',')[1];
        sendDataToBackend({
          staffName: document.getElementById("staffName").value,
          healthFacility: document.getElementById("healthFacility").value,
          clientId: document.getElementById("clientId").value,
          clientName: document.getElementById("clientName").value,
          batchNumber: document.getElementById("batchNumber").value,
          expiryDate: document.getElementById("expiryDate").value,
          amountOnHand: document.getElementById("amountOnHand").value,
          fileData: base64Data,
          fileName: file.name,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    } else {
      sendDataToBackend({
        staffName: document.getElementById("staffName").value,
        healthFacility: document.getElementById("healthFacility").value,
        clientId: document.getElementById("clientId").value,
        clientName: document.getElementById("clientName").value,
        batchNumber: document.getElementById("batchNumber").value,
        expiryDate: document.getElementById("expiryDate").value,
        amountOnHand: document.getElementById("amountOnHand").value,
        fileData: null,
        fileName: null,
        mimeType: null
      });
    }
  });
});

function sendDataToBackend(data) {
  google.script.run
    .withSuccessHandler(function (response) {
      alert(response.message);
      document.getElementById("registryForm").reset();
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit Report";
    })
    .withFailureHandler(function (error) {
      alert("Error: " + error.message);
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit Report";
    })
    .processFormSubmission(data);
}
