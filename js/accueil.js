const startBtn = document.getElementById("start-btn");
const topPanel = document.querySelector(".top-panel");
const bottomPanel = document.querySelector(".bottom-panel");

startBtn.addEventListener("click", () => {
  // Active l'effet de transition type "combat Pokémon"
  topPanel.style.transform = "scaleY(1)";
  bottomPanel.style.transform = "scaleY(1)";

  // Attendre que l’animation se termine avant de rediriger
  setTimeout(() => {
    window.location.href = "../pokedex/index.html";
  });
});
