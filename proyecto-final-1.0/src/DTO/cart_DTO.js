export function cartDTO() {
  const date = new Date().toLocaleString();

    return {
      timestamp: date,
      products: [],
    };
}
