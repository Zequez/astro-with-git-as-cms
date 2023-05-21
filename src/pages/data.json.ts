import type { APIRoute } from "astro";
import { readFileSync, writeFileSync } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const DATA_STORE = path.join(__dirname, "../../data_store.json");
const DATA_STORE = "./data_store.json";

export const post: APIRoute = async ({ params, request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const data = await request.json();
    writeFileSync(DATA_STORE, JSON.stringify(data));
    console.log("Data updated", data);
    return {
      body: JSON.stringify(data),
    };
  } else {
    return new Response("Bad request", { status: 400 });
  }
};

export const get: APIRoute = async ({ params, request }) => {
  const data = readFileSync(DATA_STORE, "utf8");
  return {
    body: data,
  };
};
