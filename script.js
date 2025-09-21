function crearCorazon() {
    const corazon = document.createElement("div");
    corazon.classList.add("corazon");
    corazon.innerHTML = "❤️";
    corazon.style.left = Math.random() * 100 + "vw";
    corazon.style.animationDuration = (3 + Math.random() * 3) + "s";
    document.body.appendChild(corazon);
  
    setTimeout(() => {
      corazon.remove();
    }, 6000);
  }
  
  setInterval(crearCorazon, 500);
  