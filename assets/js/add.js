import { apiAdd } from "./api.js";
import { formDataToPayload, hideAlert, showAlert } from "./utils.js";

const addForm = document.getElementById("addForm");
const alertBox = document.getElementById("alertBox");

addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert(alertBox);

  try {
    const payload = formDataToPayload(addForm);
    await apiAdd(payload);
    showAlert(alertBox, "Data berhasil ditambahkan", "success");
    addForm.reset();
  } catch (error) {
    showAlert(alertBox, error.message, "error");
  }
});
