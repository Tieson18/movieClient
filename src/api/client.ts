import { AnonymousAuthenticationProvider } from "@microsoft/kiota-abstractions";
import {
  FetchRequestAdapter,
  HttpClient,
} from "@microsoft/kiota-http-fetchlibrary";
import { createMovieClient } from "../../client/movieClient.ts";
import type { MovieClient } from "../../client/movieClient.ts";

function initializeClient(): MovieClient {
  const requestAdapter = new FetchRequestAdapter(
    new AnonymousAuthenticationProvider(),
    undefined,
    undefined,
    new HttpClient(fetch.bind(globalThis)), // ✅ native fetch, bound correctly
  );

  requestAdapter.baseUrl = import.meta.env.VITE_API_BASE_URL;

  return createMovieClient(requestAdapter);
}

let clientInstance: MovieClient | null = null;

export function getClient(): MovieClient {
  if (!clientInstance) {
    clientInstance = initializeClient();
  }
  return clientInstance;
}

export type { MovieClient };
