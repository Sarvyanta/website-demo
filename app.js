alert("APP JS IS RUNNING");

fetch("config/data.json")
    .then(response => {
        alert("data.json status: " + response.status);
        return response.json();
    })
    .then(data => {
        alert("DATA LOADED: " + JSON.stringify(data));
    })
    .catch(error => {
        alert("DATA ERROR: " + error);
    });
