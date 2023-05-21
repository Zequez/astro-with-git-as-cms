import type { APIRoute } from "astro";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const DATA_STORE = "data_store.json";

export const post: APIRoute = async ({ params, request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const data = await request.json();
    const dataStorePath = path.join(process.cwd(), DATA_STORE);
    writeFileSync(dataStorePath, JSON.stringify(data));
    console.log("Data updated", data);
    return {
      body: JSON.stringify(data),
    };
  } else {
    return new Response("Bad request", { status: 400 });
  }
};

export const get: APIRoute = async ({ params, request }) => {
  const dataStorePath = path.join(process.cwd(), DATA_STORE);
  const data = readFileSync(dataStorePath, "utf8");
  return {
    body: data,
  };
};
