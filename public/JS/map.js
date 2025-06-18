
	mapboxgl.accessToken = mapToken;
	// mapboxgl.accessToken = 'pk.eyJ1IjoicHJha2FzaC0yMjAyODAxMDcxMjMiLCJhIjoiY21jMDdzNnllMGVrbTJsc2ZlMTA1cHM2MCJ9.qj8OUouonmMWFJyFAbfQEw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });
    console.log(listing.geometry.coordinates);
    const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.title}</h4> <p>Exact location provide after booking</p>`))
        .addTo(map);