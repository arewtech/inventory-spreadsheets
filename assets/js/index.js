import { apiDelete, apiGetDetail, apiGetMaster, apiUpdate } from "./api.js";
import { formatCurrency, formDataToPayload, hideAlert, showAlert } from "./utils.js";

const tableBody = document.getElementById("tableBody");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const alertBox = document.getElementById("alertBox");
const btnReload = document.getElementById("btnReload");

const itemModal = document.getElementById("itemModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancel = document.getElementById("btnCancel");
const editForm = document.getElementById("editForm");
const btnDelete = document.getElementById("btnDelete");

let activeKodeBarang = "";

function setLoading(isLoading) {
  loadingState.classList.toggle("hidden", !isLoading);
}

function setEmpty(isEmpty) {
  emptyState.classList.toggle("hidden", !isEmpty);
}

function openModal() {
  itemModal.classList.remove("hidden");
  itemModal.classList.add("flex");
}

function closeModal() {
  itemModal.classList.add("hidden");
  itemModal.classList.remove("flex");
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
}

function renderRows(items) {
  tableBody.innerHTML = "";

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2 font-medium">${item.kode_barang || "-"}</td>
      <td class="px-3 py-2">${item.nama || "-"}</td>
      <td class="px-3 py-2">${item.kategori || "-"}</td>
      <td class="px-3 py-2">${item.satuan || "-"}</td>
      <td class="px-3 py-2 text-right">${formatCurrency(item.harga_beli)}</td>
      <td class="px-3 py-2 text-right">${formatCurrency(item.harga_jual)}</td>
      <td class="px-3 py-2 text-right">${item.stok ?? 0}</td>
      <td class="px-3 py-2 text-right">${item.stok_min ?? 0}</td>
      <td class="px-3 py-2 text-center">
        <button
          type="button"
          data-kode="${item.kode_barang}"
          class="btn-detail rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
        >
          Detail/Edit
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

async function loadData() {
  hideAlert(alertBox);
  setLoading(true);
  setEmpty(false);

  try {
    const items = await apiGetMaster();
    renderRows(items);
    setEmpty(items.length === 0);
  } catch (error) {
    tableBody.innerHTML = "";
    setEmpty(true);
    showAlert(alertBox, error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function handleOpenDetail(kodeBarang) {
  hideAlert(alertBox);

  try {
    const detail = await apiGetDetail(kodeBarang);
    activeKodeBarang = detail.kode_barang;
    fillForm(detail);
    openModal();
  } catch (error) {
    showAlert(alertBox, error.message, "error");
  }
}

async function handleUpdate(event) {
  event.preventDefault();
  hideAlert(alertBox);

  try {
    const payload = formDataToPayload(editForm);
    await apiUpdate(payload);
    showAlert(alertBox, "Data berhasil diupdate", "success");
    closeModal();
    await loadData();
  } catch (error) {
    showAlert(alertBox, error.message, "error");
  }
}

async function handleDelete() {
  if (!activeKodeBarang) {
    showAlert(alertBox, "Kode barang tidak valid", "error");
    return;
  }

  const confirmed = window.confirm(`Hapus data ${activeKodeBarang}?`);
  if (!confirmed) {
    return;
  }

  hideAlert(alertBox);

  try {
    await apiDelete(activeKodeBarang);
    showAlert(alertBox, "Data berhasil dihapus", "success");
    closeModal();
    await loadData();
  } catch (error) {
    showAlert(alertBox, error.message, "error");
  }
}

btnReload.addEventListener("click", loadData);

btnCloseModal.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);
itemModal.addEventListener("click", (event) => {
  if (event.target === itemModal) {
    closeModal();
  }
});

editForm.addEventListener("submit", handleUpdate);
btnDelete.addEventListener("click", handleDelete);

tableBody.addEventListener("click", (event) => {
  const target = event.target.closest(".btn-detail");
  if (!target) {
    return;
  }

  const kodeBarang = target.dataset.kode;
  if (kodeBarang) {
    handleOpenDetail(kodeBarang);
  }
});

loadData();
