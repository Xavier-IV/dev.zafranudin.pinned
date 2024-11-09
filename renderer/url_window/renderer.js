document.getElementById("toggle-button").addEventListener("click", () => {
  window.electronAPI.toggleSize(); // Use electronAPI from preload
});
