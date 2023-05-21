import type { APIRoute } from "astro";
import { promises as fs } from "fs";

const DATA_STORE = "data_store.json";

export const post: APIRoute = async ({ params, request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const data = await request.json();
    await fs.writeFile(DATA_STORE, JSON.stringify(data));
    console.log("Data updated", data);
    return {
      body: JSON.stringify(data),
    };
  } else {
    return new Response("Bad request", { status: 400 });
  }
};

export const get: APIRoute = async ({ params, request }) => {
  const data = await fs.readFile(DATA_STORE, "utf8");
  return {
    body: data,
  };
};
