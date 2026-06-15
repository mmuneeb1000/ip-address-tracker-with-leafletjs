const form = document.getElementById("search-form");
const input = document.getElementById("search-input");

export function initSearchForm(onSearch) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();

    if (!query) return;

    await onSearch(query);
  });
}
