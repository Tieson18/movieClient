import { AnonymousAuthenticationProvider } from "@microsoft/kiota-abstractions";
import type { RequestInformation } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { createMovieClient, type MovieClient } from "./client/movieClient";
import { getToken } from "../utils/auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const applyAuthHeader = (requestInfo: RequestInformation) => {
  const token = getToken();

  if (token) {
    requestInfo.headers.add("Authorization", `Bearer ${token}`);
  }
};

const patchAdapter = (adapter: FetchRequestAdapter) => {
  const originalSend = adapter.send.bind(adapter);
  adapter.send = async (requestInfo, deserializer, errorMappings) => {
    applyAuthHeader(requestInfo);
    return originalSend(requestInfo, deserializer, errorMappings);
  };

  const originalSendCollection = adapter.sendCollection.bind(adapter);
  adapter.sendCollection = async (requestInfo, deserializer, errorMappings) => {
    applyAuthHeader(requestInfo);
    return originalSendCollection(requestInfo, deserializer, errorMappings);
  };

  const originalSendCollectionOfPrimitive =
    adapter.sendCollectionOfPrimitive.bind(adapter);
  adapter.sendCollectionOfPrimitive = async (
    requestInfo,
    responseType,
    errorMappings,
  ) => {
    applyAuthHeader(requestInfo);
    return originalSendCollectionOfPrimitive(
      requestInfo,
      responseType,
      errorMappings,
    );
  };

  const originalSendPrimitive = adapter.sendPrimitive.bind(adapter);
  adapter.sendPrimitive = async (requestInfo, responseType, errorMappings) => {
    applyAuthHeader(requestInfo);
    return originalSendPrimitive(requestInfo, responseType, errorMappings);
  };

  const originalSendNoResponseContent =
    adapter.sendNoResponseContent.bind(adapter);
  adapter.sendNoResponseContent = async (requestInfo, errorMappings) => {
    applyAuthHeader(requestInfo);
    return originalSendNoResponseContent(requestInfo, errorMappings);
  };

  const originalSendEnum = adapter.sendEnum.bind(adapter);
  adapter.sendEnum = async (requestInfo, enumObject, errorMappings) => {
    applyAuthHeader(requestInfo);
    return originalSendEnum(requestInfo, enumObject, errorMappings);
  };

  const originalSendCollectionOfEnum =
    adapter.sendCollectionOfEnum.bind(adapter);
  adapter.sendCollectionOfEnum = async (
    requestInfo,
    enumObject,
    errorMappings,
  ) => {
    applyAuthHeader(requestInfo);
    return originalSendCollectionOfEnum(requestInfo, enumObject, errorMappings);
  };
};

function initializeClient(): MovieClient {
  const authProvider = new AnonymousAuthenticationProvider();
  const adapter = new FetchRequestAdapter(authProvider);
  adapter.baseUrl = API_BASE_URL;
  patchAdapter(adapter);

  return createMovieClient(adapter);
}

let clientInstance: MovieClient | undefined;

export function getClient(): MovieClient {
  if (!clientInstance) {
    clientInstance = initializeClient();
  }

  return clientInstance;
}

export type { MovieClient };
