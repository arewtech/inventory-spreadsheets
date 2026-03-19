export function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = String(value || "")
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/[^\d-]/g, "");

  if (!cleaned || cleaned === "-") {
    return 0;
  }

  return Number(cleaned);
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

export function formatNumberWithDots(value) {
  const numberValue = toNumber(value);
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(numberValue);
}

export function bindCurrencyInputs(rootElement) {
  const inputs = rootElement.querySelectorAll('input[data-currency="true"]');

  inputs.forEach((input) => {
    const formatInput = () => {
      const numeric = toNumber(input.value);
      input.value = numeric > 0 ? formatNumberWithDots(numeric) : input.value.replace(/[^\d]/g, "");
    };

    input.addEventListener("input", formatInput);
    input.addEventListener("blur", formatInput);
  });
}

export function setGlobalLoading(loaderElement, isLoading, message = "Memproses...") {
  if (!loaderElement) {
    return;
  }

  const textEl = loaderElement.querySelector("div");
  if (textEl) {
    textEl.textContent = message;
  }

  loaderElement.classList.toggle("hidden", !isLoading);
  loaderElement.classList.toggle("flex", isLoading);
}

export async function swalConfirm(options) {
  if (typeof Swal === "undefined") {
    return window.confirm(options?.text || "Lanjutkan?");
  }

  const result = await Swal.fire({
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    ...options,
  });

  return result.isConfirmed;
}

export async function swalSuccess(title, text = "") {
  if (typeof Swal === "undefined") {
    return;
  }

  await Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1400,
    showConfirmButton: false,
  });
}

export async function swalError(title, text) {
  if (typeof Swal === "undefined") {
    alert(`${title}: ${text}`);
    return;
  }

  await Swal.fire({
    icon: "error",
    title,
    text,
  });
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
