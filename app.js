fetch("config/data.json")
    .then(response => response.json())
    .then(data => {

        document.getElementById("businessName").textContent = data.businessName;
        document.getElementById("tagline").textContent = data.tagline;
        document.getElementById("description").textContent = data.description;
        document.getElementById("phone").textContent = "Phone: " + data.phone;
        document.getElementById("location").textContent = "Location: " + data.location;

        const servicesList = document.getElementById("servicesList");

        data.services.forEach(service => {
            const listItem = document.createElement("li");
            listItem.textContent = service;
            servicesList.appendChild(listItem);
        });

    })
    .catch(error => {
        console.error("Error loading business data:", error);
    });
