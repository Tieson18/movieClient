const fallbackMessage = "Something went wrong. Please try again.";

interface ErrorLike {
  error?: unknown;
  errorEscaped?: unknown;
  message?: unknown;
  responseBody?: {
    error?: unknown;
    errorEscaped?: unknown;
    details?: unknown;
    additionalData?: Record<string, unknown>;
  };
  additionalData?: Record<string, unknown>;
}

interface ValidationDetailLike {
  path?: unknown;
  message?: unknown;
}

const readString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const readErrorText = (value: unknown): string | null => {
  const directValue = readString(value);

  if (directValue) {
    return directValue;
  }

  if (typeof value === "object" && value !== null && "message" in value) {
    return readString((value as { message?: unknown }).message);
  }

  return null;
};

const readValidationDetails = (details: unknown): string | null => {
  if (!Array.isArray(details)) {
    return null;
  }

  const messages = details
    .map((detail) => {
      if (typeof detail !== "object" || detail === null) {
        return null;
      }

      const validationDetail = detail as ValidationDetailLike;
      const message = readString(validationDetail.message);

      if (!message) {
        return null;
      }

      const path = readString(validationDetail.path)?.replace(/^body\./, "");
      return path ? `${path}: ${message}` : message;
    })
    .filter((message): message is string => message !== null);

  return messages.length > 0 ? messages.join("; ") : null;
};

const readKiotaError = (error: unknown): string | null => {
  const candidate = error as ErrorLike;
  const details =
    readValidationDetails(candidate.additionalData?.details) ??
    readValidationDetails(candidate.responseBody?.details) ??
    readValidationDetails(candidate.responseBody?.additionalData?.details);
  const message =
    readErrorText(candidate.errorEscaped) ??
    readErrorText(candidate.error) ??
    readErrorText(candidate.responseBody?.errorEscaped) ??
    readErrorText(candidate.responseBody?.error) ??
    readErrorText(candidate.message);

  if (message && details) {
    return `${message}: ${details}`;
  }

  return details ?? message;
};

export const toError = (error: unknown, fallback = fallbackMessage): Error => {
  const message = readKiotaError(error) ?? fallback;

  if (!(error instanceof Error)) {
    return new Error(message);
  }

  error.message = message;
  return error;
};
