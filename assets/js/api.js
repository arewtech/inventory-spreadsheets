const API_URL = "https://script.google.com/macros/s/stfu";

function buildUrl(action, query = {}) {
  const params = new URLSearchParams({ action, ...query });
  return `${API_URL}?${params.toString()}`;
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiGetMaster() {
  try {
    const response = await fetch(buildUrl("get"));
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await parseResponse(response);
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object") {
      return [data];
    }
    return [];
  } catch (error) {
    throw new Error(`Gagal mengambil data: ${error.message}`);
  }
}

export async function apiGetDetail(kodeBarang) {
  try {
    const response = await fetch(buildUrl("getById", { kode_barang: kodeBarang }));
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await parseResponse(response);
    if (!data || typeof data !== "object") {
      throw new Error("Data tidak ditemukan");
    }
    return data;
  } catch (error) {
    throw new Error(`Gagal mengambil detail: ${error.message}`);
  }
}

export async function apiAdd(payload) {
  try {
    const response = await fetch(buildUrl("add"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await parseResponse(response);
  } catch (error) {
    throw new Error(`Gagal menambah data: ${error.message}`);
  }
}

export async function apiUpdate(payload) {
  try {
    const response = await fetch(buildUrl("update"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await parseResponse(response);
  } catch (error) {
    throw new Error(`Gagal update data: ${error.message}`);
  }
}

export async function apiDelete(kodeBarang) {
  try {
    const response = await fetch(buildUrl("delete"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kode_barang: kodeBarang }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await parseResponse(response);
  } catch (error) {
    throw new Error(`Gagal hapus data: ${error.message}`);
  }
}
