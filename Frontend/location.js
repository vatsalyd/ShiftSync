const map = L.map('map').setView([51.505, -0.09], 13); // Default: London coordinates

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get the user's current location and update the map view
function trackLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLocation = [position.coords.latitude, position.coords.longitude];

            // Center the map on the user's location
            map.setView(userLocation, 15);

            // Perform reverse geocoding to get the address
            getAddress(userLocation, function (address) {
                // Add a marker at the user's location and show the address in the popup
                L.marker(userLocation).addTo(map)
                    .bindPopup(`Your address: ${address}`)
                    .openPopup();
            });
        }, function () {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to perform reverse geocoding using Nominatim API
function getAddress(latlng, callback) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latlng[0]}&lon=${latlng[1]}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                callback(data.display_name); // Use the display name from the response
            } else {
                callback("Address not found");
            }
        })
        .catch(error => {
            console.error('Error retrieving address:', error);
            callback("Unable to retrieve address");
        });
}

// Call the location tracking function on page load
window.onload = function() {
    trackLocation();
};
