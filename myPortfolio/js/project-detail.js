
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const zoomImages = document.querySelectorAll(".zoom-image");

zoomImages.forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
});

lightbox.addEventListener("click", (event) => {
  // Close only when the background is clicked
  if (event.target === lightbox) {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
    lightboxImage.alt = "";
  }
});

// Close with the Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
    lightboxImage.alt = "";
  }
});
