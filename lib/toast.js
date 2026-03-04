export const toast = {
  success: (title, description) => dispatch("success", title, description),
  error: (title, description) => dispatch("error", title, description),
  warn: (title, description) => dispatch("warn", title, description),
  info: (title, description) => dispatch("info", title, description),
};

const dispatch = (type, title, description) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("eco-toast", {
      detail: {
        id: Math.random().toString(36).substring(2, 9), // Random ID
        type,
        title,
        description,
      },
    });
    window.dispatchEvent(event);
  }
};
