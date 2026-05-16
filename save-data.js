import { getStore } from "@netlify/blobs";

export default async (request, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405, headers
    });
  }

  try {
    const store = getStore({ name: "crm-data" });
    const data = await request.json();

    // Validar estructura básica
    const safeData = {
      contacts: Array.isArray(data.contacts) ? data.contacts : [],
      deals: Array.isArray(data.deals) ? data.deals : [],
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      notes: Array.isArray(data.notes) ? data.notes : []
    };

    await store.set("app-data", JSON.stringify(safeData), {
      metadata: { type: "crm-backup", updatedAt: new Date().toISOString() }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (error) {
    console.error("Error guardando datos:", error);
    return new Response(JSON.stringify({ error: "Error al guardar" }), {
      status: 500, headers
    });
  }
};