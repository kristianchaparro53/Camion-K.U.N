let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 31.598856, lng: -106.406284 },
        zoom: 15,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const start = { lat: 31.598856, lng: -106.406284 };
    const end = { lat: 31.600856, lng: -106.416084 };

    const request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
        }
    });
}
initMap()