alert("1 - APP JS RUNNING");

fetch("config/data.json")
    .then(function(response) {
        alert("2 - Response received: " + response.status);
        return response.text();
    })
    .then(function(text) {
        alert("3 - File content: " + text);
    })
    .catch(function(error) {
        alert("ERROR: " + error.message);
    }); 
