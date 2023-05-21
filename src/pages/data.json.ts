import type { APIRoute } from "astro";
import { readFileSync, writeFileSync } from "fs";
import axios, { AxiosRequestConfig } from "axios";

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const ADMIN_PASSPHRASE = import.meta.env.ADMIN_PASSPHRASE;
const GITHUB_OWNER = "zequez";
const GITHUB_REPO = "astro-with-git-as-cms";
const GITHUB_BRANCH = "main";
const DATA_STORE = "./data_store.json";

export const post: APIRoute = async ({ params, request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const data = await request.json();
    if (import.meta.env.DEV) {
      writeFileSync(DATA_STORE, JSON.stringify(data));
    }
    if (request.headers.get("Admin-Passphrase") === ADMIN_PASSPHRASE) {
      updateDataStore(data);
      console.log("Data updated");
      return {
        body: JSON.stringify(data),
      };
    } else {
      return new Response("Wrong passphrase", { status: 401 });
    }
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

async function updateDataStore(data: object): Promise<void> {
  try {
    // Set up the API endpoint
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data_store.json?ref=${GITHUB_BRANCH}`;

    // Encode the data as base64
    const content = Buffer.from(JSON.stringify(data)).toString("base64");

    // Make a GET request to retrieve the latest commit SHA of the file
    const fileData = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    const putApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data_store.json`;

    // Build the payload for updating the file
    const payload = {
      message: "Update data_store.json",
      content,
      sha: fileData.data.sha,
      branch: GITHUB_BRANCH,
    };

    // Make a PUT request to update the file
    await axios.put(putApiUrl, payload, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    console.log("Data store updated successfully!");
  } catch (error) {
    console.error("Error updating data store:", error);
  }
}
