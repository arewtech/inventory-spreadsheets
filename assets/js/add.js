import { apiAdd } from "./api.js";
import {
  bindCurrencyInputs,
  formDataToPayload,
  hideAlert,
  setGlobalLoading,
  showAlert,
  swalConfirm,
  swalError,
  swalSuccess,
} from "./utils.js";

const addForm = document.getElementById("addForm");
const alertBox = document.getElementById("alertBox");
const globalLoader = document.getElementById("globalLoader");

bindCurrencyInputs(addForm);

addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert(alertBox);

  const confirmed = await swalConfirm({
    title: "Simpan data baru?",
    text: "Pastikan data barang sudah benar.",
    confirmButtonText: "Simpan",
  });

  if (!confirmed) {
    return;
  }

  try {
    setGlobalLoading(globalLoader, true, "Menyimpan data...");
    const payload = formDataToPayload(addForm);
    await apiAdd(payload);
    await swalSuccess("Berhasil", "Data berhasil ditambahkan");
    showAlert(alertBox, "Data berhasil ditambahkan", "success");
    window.location.href = "index.html";
  } catch (error) {
    await swalError("Gagal tambah data", error.message);
    showAlert(alertBox, error.message, "error");
  } finally {
    setGlobalLoading(globalLoader, false);
  }
});
