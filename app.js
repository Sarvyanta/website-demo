document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);

  const businessId =
    params.get("business") || "realisticportraitartist";

  const businessFolder =
    "businesses/" + businessId + "/";

  const configUrl =
    businessFolder + "config/data.json";

  let businessData = null;
  let galleryImages = [];
  let currentImage = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function resolvePath(path) {
    if (!path) return "";

    path = String(path);

    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("//") ||
      path.startsWith("/")
    ) {
      return path;
    }

    return businessFolder + path;
  }

  function formatPrice(price) {
    if (price === undefined || price === null || price === "") {
      return "";
    }

    if (typeof price === "number") {
      return "₹" + price.toLocaleString("en-IN");
    }

    return String(price);
  }

  function getWhatsAppNumber() {
    if (!businessData || !businessData.whatsapp) {
      return "";
    }

    return String(
      businessData.whatsapp.number || ""
    ).replace(/\D/g, "");
  }

  function createWhatsAppButton(message) {
    const number = getWhatsAppNumber();

    if (!number) return null;

    const button = document.createElement("a");

    button.className = "section-whatsapp";

    button.href =
      "https://wa.me/" +
      number +
      "?text=" +
      encodeURIComponent(message);

    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = "WhatsApp";

    return button;
  }

  fetch(configUrl)
    .then(function (response) {

      if (!response.ok) {
        throw new Error(
          "Unable to load business data: " + configUrl
        );
      }

      return response.json();
    })
    .then(function (data) {

      businessData = data;

      renderBusiness();
    })
    .catch(function (error) {

      console.error("Sarvyanta error:", error);

      $("businessName").textContent =
        "Unable to load business";

      $("description").textContent =
        error.message;
    });

  function renderBusiness() {

    const business =
      businessData.business || {};

    const sections =
      businessData.sections || {};

    document.title =
      business.name || "Sarvyanta";

    $("businessName").textContent =
      business.name || "";

    $("tagline").textContent =
      business.tagline || "";

    $("description").textContent =
      business.description || "";

    if (business.logo) {

      const logo = $("businessLogo");

      logo.src =
        resolvePath(business.logo);

      logo.style.display = "block";
    }

    if (sections.about === false) {
      $("about").style.display = "none";
    }

    if (sections.services === false) {
      $("services").style.display = "none";
    } else {
      renderServices();
    }

    if (sections.products === false) {
      $("products").style.display = "none";
    } else {
      renderProducts();
      renderNotes();
    }

    if (sections.gallery === false) {
      $("gallery").style.display = "none";
    } else {
      renderGallery();
    }

    if (sections.contact === false) {
      $("contact").style.display = "none";
    } else {
      renderContact();
    }

    renderSocial();
  }

  function renderServices() {

    const container = $("servicesList");
    const whatsappContainer = $("servicesWhatsapp");

    container.innerHTML = "";
    whatsappContainer.innerHTML = "";

    const services =
      businessData.services || [];

    if (!Array.isArray(services) || services.length === 0) {
      return;
    }

    services.forEach(function (service) {

      const item =
        document.createElement("div");

      item.className = "service-item";

      const title =
        document.createElement("h3");

      title.textContent = service;

      item.appendChild(title);
      container.appendChild(item);
    });

    const whatsapp =
      createWhatsAppButton(
        "Hi, I am interested in your portrait services."
      );

    if (whatsapp) {
      whatsappContainer.appendChild(whatsapp);
    }
  }

  function renderProducts() {

    const container = $("productsList");
    const whatsappContainer = $("productsWhatsapp");

    container.innerHTML = "";
    whatsappContainer.innerHTML = "";

    const products =
      businessData.products || [];

    if (!Array.isArray(products) || products.length === 0) {
      return;
    }

    products.forEach(function (product) {

      const card =
        document.createElement("div");

      card.className = "product-card";

      const title =
        document.createElement("h3");

      title.textContent =
        product.name || "";

      card.appendChild(title);

      if (
        product.price !== undefined &&
        product.price !== null
      ) {

        const price =
          document.createElement("div");

        price.className =
          "product-price";

        price.textContent =
          formatPrice(product.price);

        card.appendChild(price);
      }

      if (product.description) {

        const description =
          document.createElement("p");

        description.textContent =
          product.description;

        card.appendChild(description);
      }

      container.appendChild(card);
    });

    const whatsapp =
      createWhatsAppButton(
        "Hi, I am interested in your portrait products."
      );

    if (whatsapp) {
      whatsappContainer.appendChild(whatsapp);
    }
  }

  function renderNotes() {

    const container =
      $("productsNotes");

    container.innerHTML = "";

    const notes =
      businessData.productsNotes || [];

    if (!Array.isArray(notes) || notes.length === 0) {
      return;
    }

    const wrapper =
      document.createElement("div");

    wrapper.className = "notes";

    const title =
      document.createElement("div");

    title.className = "notes-title";
    title.textContent = "Please Note";

    wrapper.appendChild(title);

    notes.forEach(function (note) {

      const item =
        document.createElement("div");

      item.className = "note";
      item.textContent = "📌 " + note;

      wrapper.appendChild(item);
    });

    container.appendChild(wrapper);
  }

  function renderGallery() {

    const container =
      $("galleryList");

    container.innerHTML = "";

    const gallery =
      businessData.gallery || [];

    if (!Array.isArray(gallery) || gallery.length === 0) {
      return;
    }

    galleryImages =
      gallery
        .map(function (item) {

          if (typeof item === "string") {
            return {
              src: resolvePath(item),
              title: ""
            };
          }

          return {
            src: resolvePath(
              item.image ||
              item.src ||
              item.path ||
              item.url ||
              ""
            ),
            title: item.title || ""
          };
        })
        .filter(function (item) {
          return item.src;
        });

    galleryImages.forEach(function (image, index) {

      const item =
        document.createElement("div");

      item.className = "gallery-item";

      const img =
        document.createElement("img");

      img.src = image.src;

      img.alt =
        image.title || "Portrait Artwork";

      img.loading = "lazy";

      img.addEventListener("click", function () {
        openGallery(index);
      });

      item.appendChild(img);

      if (image.title) {

        const caption =
          document.createElement("div");

        caption.className =
          "gallery-caption";

        caption.textContent =
          image.title;

        item.appendChild(caption);
      }

      container.appendChild(item);
    });
  }

  function openGallery(index) {

    if (!galleryImages.length) return;

    currentImage = index;

    updateLightbox();

    $("lightbox")
      .classList
      .add("active");
  }

  function updateLightbox() {

    const image =
      galleryImages[currentImage];

    $("lightboxImage").src =
      image.src;

    $("lightboxImage").alt =
      image.title || "Portrait Artwork";

    $("lightboxCounter").textContent =
      (currentImage + 1) +
      " / " +
      galleryImages.length;
  }

  function closeGallery() {

    $("lightbox")
      .classList
      .remove("active");
  }

  function nextImage() {

    if (!galleryImages.length) return;

    currentImage =
      (currentImage + 1) %
      galleryImages.length;

    updateLightbox();
  }

  function previousImage() {

    if (!galleryImages.length) return;

    currentImage =
      (currentImage - 1 +
        galleryImages.length) %
      galleryImages.length;

    updateLightbox();
  }

  $("lightboxClose")
    .addEventListener("click", closeGallery);

  $("lightboxNext")
    .addEventListener("click", nextImage);

  $("lightboxPrev")
    .addEventListener("click", previousImage);

  $("lightbox")
    .addEventListener("click", function (event) {

      if (event.target === $("lightbox")) {
        closeGallery();
      }
    });

  document.addEventListener("keydown", function (event) {

    if (
      !$("lightbox")
        .classList
        .contains("active")
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeGallery();
    }

    if (event.key === "ArrowRight") {
      nextImage();
    }

    if (event.key === "ArrowLeft") {
      previousImage();
    }
  });

  function renderContact() {

    const contact =
      businessData.contact || {};

    if (contact.phone) {
      $("phone").textContent =
        "Phone: " + contact.phone;
    }

    if (contact.location) {
      $("location").textContent =
        "Location: " + contact.location;
    }

    const number =
      getWhatsAppNumber();

    const button =
      $("whatsappButton");

    if (number) {

      button.href =
        "https://wa.me/" + number;

      button.style.display =
        "inline-block";

    } else {

      button.style.display =
        "none";
    }
  }

  function renderSocial() {

    const social =
      businessData.social || {};

    setupSocial(
      "instagramButton",
      social.instagram
    );

    setupSocial(
      "facebookButton",
      social.facebook
    );
  }

  function setupSocial(id, url) {

    const button = $(id);

    if (!url) {

      button.style.display =
        "none";

      return;
    }

    button.href = url;

    button.style.display =
      "inline-block";
  }

});
