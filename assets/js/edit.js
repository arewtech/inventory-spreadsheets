import { apiGetDetail, apiUpdate } from "./api.js";
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

const editForm = document.getElementById("editForm");
const alertBox = document.getElementById("alertBox");
const globalLoader = document.getElementById("globalLoader");

bindCurrencyInputs(editForm);

function getKodeBarangFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("kode_barang") || "";
}

function fillForm(data) {
  editForm.kode_barang.value = data.kode_barang || "";
  editForm.nama.value = data.nama || "";
  editForm.kategori.value = data.kategori || "";
  editForm.satuan.value = data.satuan || "";
  editForm.harga_beli.value = data.harga_beli ?? 0;
  editForm.harga_jual.value = data.harga_jual ?? 0;
  editForm.stok.value = data.stok ?? 0;
  editForm.stok_min.value = data.stok_min ?? 0;

  const currencyInputs = editForm.querySelectorAll('input[data-currency="true"]');
  currencyInputs.forEach((input) => {
    input.dispatchEvent(new Event("input"));
  });
}

async function loadDetail() {
  const kodeBarang = getKodeBarangFromQuery();
  if (!kodeBarang) {
    showAlert(alertBox, "Kode barang tidak ditemukan", "error");
    await swalError("Data tidak valid", "Kode barang tidak ditemukan di URL");
    return;
  }

  hideAlert(alertBox);

  try {
    setGlobalLoading(globalLoader, true, "Memuat detail...");
    const detail = await apiGetDetail(kodeBarang);
    fillForm(detail);
  } catch (error) {
    await swalError("Gagal ambil detail", error.message);
    showAlert(alertBox, error.message, "error");
  } finally {
    setGlobalLoading(globalLoader, false);
  }
}

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert(alertBox);

  const confirmed = await swalConfirm({
    title: "Simpan perubahan?",
    text: "Data barang akan diupdate.",
    confirmButtonText: "Simpan",
  });

  if (!confirmed) {
    return;
  }

  try {
    setGlobalLoading(globalLoader, true, "Menyimpan perubahan...");
    const payload = formDataToPayload(editForm);
    await apiUpdate(payload);
    await swalSuccess("Berhasil", "Data berhasil diupdate");
    showAlert(alertBox, "Data berhasil diupdate", "success");
    window.location.href = "index.html";
  } catch (error) {
    await swalError("Gagal update data", error.message);
    showAlert(alertBox, error.message, "error");
  } finally {
    setGlobalLoading(globalLoader, false);
  }
});

loadDetail();
