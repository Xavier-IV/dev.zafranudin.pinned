import "../../src/output.css";

document.getElementById("toggle-button").addEventListener("click", () => {
  window.electronAPI.goBack(); // Use electronAPI from preload
});
