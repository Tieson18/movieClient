const fallbackMessage = "Something went wrong. Please try again.";

const readKiotaError = (error: unknown): string | null => {
  const candidate = error as {
    responseBody?: { error?: string; errorEscaped?: { message?: string } };
    message?: string;
  };

  const bodyString = candidate.responseBody?.error;
  if (typeof bodyString === "string" && bodyString.trim()) {
    return bodyString;
  }

  const bodyMessage = candidate.responseBody?.errorEscaped?.message;
  if (typeof bodyMessage === "string" && bodyMessage.trim()) {
    return bodyMessage;
  }

  if (typeof candidate.message === "string" && candidate.message.trim()) {
    return candidate.message;
  }

  return null;
};

export const toError = (error: unknown, fallback = fallbackMessage): Error => {
  const message = readKiotaError(error) ?? fallback;

  if (!(error instanceof Error)) {
    return new Error(message);
  }

  error.message = message;
  return error;
};
