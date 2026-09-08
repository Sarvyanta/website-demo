document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     BUSINESS SELECTION
     ========================= */

  const params = new URLSearchParams(window.location.search);

  const businessId =
    params.get("business") || "realisticportraitartist";

  const businessFolder =
    "businesses/" + businessId + "/";

  const configUrl =
    businessFolder + "config/data.json";


  /* =========================
     GLOBAL VARIABLES
     ========================= */

  let businessData = null;
  let galleryImages = [];
  let currentImage = 0;


  /* =========================
     HELPER
     ========================= */

  function $(id) {
    return document.getElementById(id);
  }


  /* =========================
     PATH RESOLVER
     ========================= */

  function resolvePath(path) {

    if (!path) {
      return "";
    }

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


  /* =========================
     PRICE FORMAT
     ========================= */

  function formatPrice(price) {

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "";
    }

    if (typeof price === "number") {
      return "₹" + price.toLocaleString("en-IN");
    }

    return String(price);
  }


  /* =========================
     WHATSAPP NUMBER
     ========================= */

  function getWhatsAppNumber() {

    if (
      !businessData ||
      !businessData.whatsapp
    ) {
      return "";
    }

    return String(
      businessData.whatsapp.number || ""
    ).replace(/\D/g, "");
  }


  /* =========================
     CREATE WHATSAPP BUTTON
     ========================= */

  function createWhatsAppButton(message) {

    const number = getWhatsAppNumber();

    if (!number) {
      return null;
    }

    const button =
      document.createElement("a");

    button.className =
      "section-whatsapp";

    button.href =
      "https://wa.me/" +
      number +
      "?text=" +
      encodeURIComponent(message);

    button.target = "_blank";

    button.rel =
      "noopener noreferrer";

    button.textContent =
      "WhatsApp";

    return button;
  }


  /* =========================
     LOAD JSON
     ========================= */

  fetch(configUrl)

    .then(function (response) {

      if (!response.ok) {
        throw new Error(
          "Unable to load business data: " +
          configUrl
        );
      }

      return response.json();
    })

    .then(function (data) {

      businessData = data;

      renderBusiness();
    })

    .catch(function (error) {

      console.error(error);

      $("businessName").textContent =
        "Unable to load business";

      $("description").textContent =
        error.message;
    });


  /* =========================
     RENDER BUSINESS
     ========================= */

  function renderBusiness() {

    const business =
      businessData.business || {};

    const sections =
      businessData.sections || {};


    /* Page information */

    document.title =
      business.name || "Sarvyanta";

    $("businessName").textContent =
      business.name || "";

    $("tagline").textContent =
      business.tagline || "";

    $("description").textContent =
      business.description || "";


    /* Logo */

    if (business.logo) {

      const logo =
        $("businessLogo");

      logo.src =
        resolvePath(business.logo);

      logo.style.display =
        "block";
    }


    /* About */

    if (sections.about === false) {

      $("about").style.display =
        "none";
    }


    /* Services */

    if (sections.services === false) {

      $("services").style.display =
        "none";

    } else {

      renderServices();
    }


    /* Products */

    if (sections.products === false) {

      $("products").style.display =
        "none";

    } else {

      renderProducts();
      renderNotes();
    }


    /* Gallery */

    if (sections.gallery === false) {

      $("gallery").style.display =
        "none";

    } else {

      renderGallery();
    }


    /* Contact */

    if (sections.contact === false) {

      $("contact").style.display =
        "none";

    } else {

      renderContact();
    }


    /* Social */

    renderSocial();
  }


  /* =========================
     SERVICES
     ========================= */

  function renderServices() {

    const container =
      $("servicesList");

    container.innerHTML = "";

    const services =
      businessData.services || [];


    if (
      !Array.isArray(services) ||
      services.length === 0
    ) {
      return;
    }


    /* Add all services */

    services.forEach(function (service) {

      const item =
        document.createElement("div");

      item.className =
        "service-item";


      const title =
        document.createElement("h3");

      title.textContent =
        service;


      item.appendChild(title);

      container.appendChild(item);
    });


    /* ONE WhatsApp button for Services */

    const whatsapp =
      createWhatsAppButton(
        "Hi, I am interested in your portrait services."
      );

    if (whatsapp) {
      container.appendChild(whatsapp);
    }
  }


  /* =========================
     PRODUCTS
     ========================= */

  function renderProducts() {

    const container =
      $("productsList");

    container.innerHTML = "";

    const products =
      businessData.products || [];


    if (
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return;
    }


    /* Add products */

    products.forEach(function (product) {

      const card =
        document.createElement("div");

      card.className =
        "product-card";


      const title =
        document.createElement("h3");

      title.textContent =
        product.name || "";


      card.appendChild(title);


      /* Price */

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


      /* Optional description */

      if (product.description) {

        const description =
          document.createElement("p");

        description.textContent =
          product.description;

        card.appendChild(description);
      }


      container.appendChild(card);
    });


    /* ONE WhatsApp button for Products */

    const whatsapp =
      createWhatsAppButton(
        "Hi, I am interested in your portrait products."
      );

    if (whatsapp) {
      container.appendChild(whatsapp);
    }
  }


  /* =========================
     PRODUCT NOTES
     ========================= */

  function renderNotes() {

    const container =
      $("productsNotes");

    container.innerHTML = "";

    const notes =
      businessData.productsNotes || [];


    if (
      !Array.isArray(notes) ||
      notes.length === 0
    ) {
      return;
    }


    const wrapper =
      document.createElement("div");

    wrapper.className =
      "notes";


    const title =
      document.createElement("div");

    title.className =
      "notes-title";

    title.textContent =
      "Please Note";


    wrapper.appendChild(title);


    notes.forEach(function (note) {

      const item =
        document.createElement("div");

      item.className =
        "note";

      item.textContent =
        "📌 " + note;

      wrapper.appendChild(item);
    });


    container.appendChild(wrapper);
  }


  /* =========================
     GALLERY
     ========================= */

  function renderGallery() {

    const container =
      $("galleryList");

    container.innerHTML = "";

    const gallery =
      businessData.gallery || [];


    if (
      !Array.isArray(gallery) ||
      gallery.length === 0
    ) {
      return;
    }


    /*
      Gallery can contain either:

      "assets/gallery/image.jpg"

      OR

      {
        "image": "assets/gallery/image.jpg",
        "title": "Example"
      }
    */

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

            title:
              item.title || ""
          };
        })

        .filter(function (item) {
          return item.src;
        });


    /* Display gallery */

    galleryImages.forEach(
      function (image, index) {

        const item =
          document.createElement("div");

        item.className =
          "gallery-item";


        const img =
          document.createElement("img");

        img.src =
          image.src;

        img.alt =
          image.title ||
          "Portrait Artwork";

        img.loading =
          "lazy";


        /* Open lightbox */

        img.addEventListener(
          "click",
          function () {

            openGallery(index);
          }
        );


        item.appendChild(img);


        /* Optional caption */

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
      }
    );

    /*
      IMPORTANT:
      No WhatsApp button is added here.
    */
  }


  /* =========================
     OPEN GALLERY
     ========================= */

  function openGallery(index) {

    if (!galleryImages.length) {
      return;
    }

    currentImage =
      index;

    updateLightbox();

    $("lightbox")
      .classList
      .add("active");
  }


  /* =========================
     UPDATE LIGHTBOX
     ========================= */

  function updateLightbox() {

    const image =
      galleryImages[currentImage];


    $("lightboxImage").src =
      image.src;


    $("lightboxImage").alt =
      image.title ||
      "Portrait Artwork";


    $("lightboxCounter").textContent =
      (currentImage + 1) +
      " / " +
      galleryImages.length;
  }


  /* =========================
     CLOSE GALLERY
     ========================= */

  function closeGallery() {

    $("lightbox")
      .classList
      .remove("active");
  }


  /* =========================
     NEXT IMAGE
     ========================= */

  function nextImage() {

    if (!galleryImages.length) {
      return;
    }

    currentImage =
      (currentImage + 1) %
      galleryImages.length;

    updateLightbox();
  }


  /* =========================
     PREVIOUS IMAGE
     ========================= */

  function previousImage() {

    if (!galleryImages.length) {
      return;
    }

    currentImage =
      (currentImage - 1 +
        galleryImages.length) %
      galleryImages.length;

    updateLightbox();
  }


  /* =========================
     LIGHTBOX BUTTONS
     ========================= */

  $("lightboxClose")
    .addEventListener(
      "click",
      closeGallery
    );


  $("lightboxNext")
    .addEventListener(
      "click",
      nextImage
    );


  $("lightboxPrev")
    .addEventListener(
      "click",
      previousImage
    );


  /* =========================
     CLOSE BY BACKGROUND
     ========================= */

  $("lightbox")
    .addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          $("lightbox")
        ) {
          closeGallery();
        }
      }
    );


  /* =========================
     KEYBOARD CONTROLS
     ========================= */

  document.addEventListener(
    "keydown",
    function (event) {

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
    }
  );


  /* =========================
     CONTACT
     ========================= */

  function renderContact() {

    const contact =
      businessData.contact || {};


    if (contact.phone) {

      $("phone").textContent =
        "Phone: " +
        contact.phone;
    }


    if (contact.location) {

      $("location").textContent =
        "Location: " +
        contact.location;
    }


    const number =
      getWhatsAppNumber();


    const button =
      $("whatsappButton");


    if (number) {

      button.href =
        "https://wa.me/" +
        number;

      button.style.display =
        "inline-block";

    } else {

      button.style.display =
        "none";
    }
  }


  /* =========================
     SOCIAL MEDIA
     ========================= */

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


  /* =========================
     SOCIAL BUTTON SETUP
     ========================= */

  function setupSocial(id, url) {

    const button =
      $(id);


    if (!url) {

      button.style.display =
        "none";

      return;
    }


    button.href =
      url;

    button.style.display =
      "inline-block";
  }

});
