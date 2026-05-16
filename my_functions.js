import { getStore } from "@netlify/blobs";

export default async (request, context) => {
  // Permitir CORS desde el mismo sitio
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const store = getStore({ name: "crm-data" });
    const data = await store.get("app-data", { type: "json" });
    const defaultData = { contacts: [], deals: [], tasks: [], notes: [] };
    return new Response(JSON.stringify(data || defaultData), { status: 200, headers });
  } catch (error) {
    console.error("Error leyendo datos:", error);
    const defaultData = { contacts: [], deals: [], tasks: [], notes: [] };
    return new Response(JSON.stringify(defaultData), { status: 200, headers });
  }
};

