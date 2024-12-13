export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    throw new Error("Could not copy text");
  }
};
