import { apiDelete, apiGetDetail, apiGetMaster } from "./api.js";
import {
  formatCurrency,
  hideAlert,
  setGlobalLoading,
  showAlert,
  swalConfirm,
  swalError,
  swalSuccess,
} from "./utils.js";

const tableBody = document.getElementById("tableBody");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const alertBox = document.getElementById("alertBox");
const btnReload = document.getElementById("btnReload");

const itemModal = document.getElementById("itemModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancel = document.getElementById("btnCancel");
const btnDelete = document.getElementById("btnDelete");
const btnEditPage = document.getElementById("btnEditPage");
const globalLoader = document.getElementById("globalLoader");

const detailKodeBarang = document.getElementById("detail_kode_barang");
const detailNama = document.getElementById("detail_nama");
const detailKategori = document.getElementById("detail_kategori");
const detailSatuan = document.getElementById("detail_satuan");
const detailHargaBeli = document.getElementById("detail_harga_beli");
const detailHargaJual = document.getElementById("detail_harga_jual");
const detailStok = document.getElementById("detail_stok");
const detailStokMin = document.getElementById("detail_stok_min");

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
  detailKodeBarang.textContent = data.kode_barang || "-";
  detailNama.textContent = data.nama || "-";
  detailKategori.textContent = data.kategori || "-";
  detailSatuan.textContent = data.satuan || "-";
  detailHargaBeli.textContent = formatCurrency(data.harga_beli ?? 0);
  detailHargaJual.textContent = formatCurrency(data.harga_jual ?? 0);
  detailStok.textContent = String(data.stok ?? 0);
  detailStokMin.textContent = String(data.stok_min ?? 0);

  if (data.kode_barang) {
    btnEditPage.href = `edit.html?kode_barang=${encodeURIComponent(data.kode_barang)}`;
  } else {
    btnEditPage.href = "edit.html";
  }
}

function renderRows(items) {
  tableBody.innerHTML = "";

  items.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.className = "cursor-pointer hover:bg-slate-50";
    tr.dataset.kode = item.kode_barang || "";
    tr.innerHTML = `
      <td class="px-3 py-2 text-center">${index + 1}</td>
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
          Detail
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
  setGlobalLoading(globalLoader, true, "Memuat data...");

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
    setGlobalLoading(globalLoader, false);
  }
}

async function handleOpenDetail(kodeBarang) {
  hideAlert(alertBox);
  setGlobalLoading(globalLoader, true, "Memuat detail...");

  try {
    const detail = await apiGetDetail(kodeBarang);
    activeKodeBarang = detail.kode_barang;
    fillForm(detail);
    openModal();
  } catch (error) {
    await swalError("Gagal ambil detail", error.message);
    showAlert(alertBox, error.message, "error");
  } finally {
    setGlobalLoading(globalLoader, false);
  }
}

async function handleDelete() {
  if (!activeKodeBarang) {
    showAlert(alertBox, "Kode barang tidak valid", "error");
    return;
  }

  const confirmed = await swalConfirm({
    title: "Hapus data?",
    text: `Data ${activeKodeBarang} akan dihapus permanen.`,
    confirmButtonText: "Hapus",
  });

  if (!confirmed) {
    return;
  }

  hideAlert(alertBox);

  try {
    setGlobalLoading(globalLoader, true, "Menghapus data...");
    await apiDelete(activeKodeBarang);
    await swalSuccess("Berhasil", "Data berhasil dihapus");
    showAlert(alertBox, "Data berhasil dihapus", "success");
    closeModal();
    await loadData();
  } catch (error) {
    await swalError("Gagal hapus data", error.message);
    showAlert(alertBox, error.message, "error");
  } finally {
    setGlobalLoading(globalLoader, false);
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

btnDelete.addEventListener("click", handleDelete);

tableBody.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-kode]");
  if (!row) {
    return;
  }

  const kodeBarang = row.dataset.kode;
  if (kodeBarang) {
    handleOpenDetail(kodeBarang);
  }
});

loadData();
