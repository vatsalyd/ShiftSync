document.getElementById('checkinForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const action = document.getElementById('action').value;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Fetch the token from local storage
            const token = localStorage.getItem('authToken');
            
            fetch('/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    action: action,
                    latitude: latitude,
                    longitude: longitude
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                } else if (data.error) {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }, function(error) {
            console.error('Error getting location:', error);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
});

// Automatically check location every minute
setInterval(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Current position: ', latitude, longitude);
        });
    }
}, 60000);
