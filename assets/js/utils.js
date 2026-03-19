export function toNumber(value) {
  return Number(value || 0);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

export function showAlert(element, message, type = "info") {
  const typeClass = {
    success: "bg-green-100 text-green-700 border border-green-200",
    error: "bg-red-100 text-red-700 border border-red-200",
    info: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  element.className = `mb-4 rounded-lg px-4 py-3 text-sm ${typeClass[type] || typeClass.info}`;
  element.textContent = message;
  element.classList.remove("hidden");
}

export function hideAlert(element) {
  element.classList.add("hidden");
}

export function formDataToPayload(formElement) {
  const formData = new FormData(formElement);
  return {
    kode_barang: String(formData.get("kode_barang") || "").trim(),
    nama: String(formData.get("nama") || "").trim(),
    kategori: String(formData.get("kategori") || "").trim(),
    satuan: String(formData.get("satuan") || "").trim(),
    harga_beli: toNumber(formData.get("harga_beli")),
    harga_jual: toNumber(formData.get("harga_jual")),
    stok: toNumber(formData.get("stok")),
    stok_min: toNumber(formData.get("stok_min")),
  };
}
