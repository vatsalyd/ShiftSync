   function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371e3; // Radius of the Earth in meters
            const φ1 = lat1 * Math.PI / 180; // Convert latitude to radians
            const φ2 = lat2 * Math.PI / 180; // Convert latitude to radians
            const Δφ = (lat2 - lat1) * Math.PI / 180; // Difference in latitudes
            const Δλ = (lon2 - lon1) * Math.PI / 180; // Difference in longitudes

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                      Math.cos(φ1) * Math.cos(φ2) *
                      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c; // Distance in meters
            return distance;
        }

        function checkDistance() {
            // Target area's latitude and longitude
            const targetLat = 21.2433095;  // Example: Latitude of a target area (e.g., Times Square)
            const targetLon = 81.3210751; // Example: Longitude of a target area

            // Get the current location of the user
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    // Calculate the distance between the user's location and the target
                    const distance = calculateDistance(userLat, userLon, targetLat, targetLon);

                    // Check if the distance is within 200 meters
                    if (distance <= 200) {
                        // Get the current time
                        const currentTime = new Date().toLocaleTimeString();
                        // Display the time
                        document.getElementById("time").innerText = `Time checked: ${currentTime}`;
                    } else {
                        // If not within 200 meters, clear the time display
                        document.getElementById("time").innerText = "";
                    }
                }, (error) => {
                    document.getElementById("time").innerText = "Error getting location: " + error.message;
                });
            } else {
                document.getElementById("time").innerText = "Geolocation is not supported by this browser.";
            }
        }
