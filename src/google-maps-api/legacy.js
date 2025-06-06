/* eslint-disable */
// @ts-nocheck
let map, infoWindow, locationWindow, movement;
const waterLocationArray = [];
let sharkData = [];

async function setUp() {
  //Create map of sharkIds and SharkMovement objects
  const movementResults = await DataHandler.listSharkMovement();
  movement = new Map();
  for (let i = 0; i < movementResults.length; i++) {
    let move = movementResults[i];
    movement.set(move.sharkID, move);
  }
}

async function initMap() {
  await setUp();

	if (!document.getElementById("map")) {
		return;
	}

  //variable declaration
  infoWindow = new google.maps.InfoWindow();
  locationWindow = new google.maps.InfoWindow();
  sharkData = await DataHandler.listSharks();
  const sharkTypeData = await DataHandler.listSharkTypes();
  const waterLocations = await DataHandler.listWaterLocations();
  const sharkRecentCoords = [];

  //console.log(waterLocations);

  //get maps library information
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");


  //create map
  map = new Map(document.getElementById("map"), {
    center: { lat: 35, lng: -100 },
    zoom: 4,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapId: "b19c6d1524be6f5c",
  });

  infoWindow = new google.maps.InfoWindow();

  const sharksResult = await DataHandler.listSharks();

  //for each shark
  for (let i = 0; i < sharksResult.length; i++) {
    const sharkID = sharksResult[i].sharkID;

    //for each shark species
    var currentSpecies;
    for(let j = 0; j < sharkTypeData.length; j++) {
      if(sharkTypeData[j].speciesID == sharkData[i].species) {
        //selects the current shark's species
        currentSpecies = sharkTypeData[j];
        break;
      }
    }

    let sharkMovement;  //if sharkMovement data does not exists then create new
    if (sharkMovement = movement.get(sharkID), sharkMovement == undefined) {
      const coor = [[sharksResult[i].originLat, sharksResult[i].originLon]];
      sharkMovement = new SharkMovementModel(sharkID, sharkID, coor, [new Date().toISOString()]);
      const newSharkMovement = await DataHandler.insertSharkMovement(sharkMovement);
      console.log("new shark movement created");
    }

    
    sharkMovement = generateMovement(sharkMovement);

    //create marker for most recent location
    let markerPosition = new google.maps.LatLng(sharkMovement.coordinates[0][0], sharkMovement.coordinates[0][1]);
    sharkRecentCoords[i] = [[sharkMovement.coordinates[0][0]],[sharkMovement.coordinates[0][1]]];
    const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
      //id: sharkId,
      map,
      position: markerPosition,
      title: new Date(sharkMovement.dateTime[0]).toLocaleString(),
      content: buildContent(sharkData[i], currentSpecies),
      zIndex: 1,
    });

    //display past movements
    for (let m = 1; m < sharkMovement.coordinates.length; m++) {
      //create Marker
      new google.maps.Marker({
        position: new google.maps.LatLng(sharkMovement.coordinates[m][0], sharkMovement.coordinates[m][1]),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          strokeColor: "#003da0",
          fillColor: "#003da0",
          fillOpacity: 1,
          strokeWeight: 1,
        },
        title: new Date(sharkMovement.dateTime[m]).toLocaleString(),
        map: map,
        zIndex: 5,//does this work?
      });

      const sharkPathCoordinates = [
        { lat: sharkMovement.coordinates[m][0], lng: sharkMovement.coordinates[m][1] },
        { lat: sharkMovement.coordinates[m-1][0], lng: sharkMovement.coordinates[m-1][1] },
      ];
      const sharkPath = new google.maps.Polyline({
        path: sharkPathCoordinates,
        geodesic: true,
        strokeColor: "#035ae6",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      sharkPath.setMap(map);
    }

    AdvancedMarkerElement.addListener("click", () => {
      toggleHighlight(AdvancedMarkerElement, sharksResult[i]);
      map.setCenter(markerPosition);
      map.setZoom(6);
    });
    
  }

  //loops through each water location
  for (let i = 0; i < waterLocations.length; i++) {

    const tempCoords = [];
    const checkCoords = [];
    var midpointLat = 0;
    var midpointLon = 0;

    //loops through all the coordinates for the current water location
    for (let j = 0; j < waterLocations[i].coordinates.length; j++) {
      tempCoords[j] = { lat: waterLocations[i].coordinates[j][0], lng: waterLocations[i].coordinates[j][1] };
      checkCoords[j] = [waterLocations[i].coordinates[j][0], waterLocations[i].coordinates[j][1]];
      midpointLat += waterLocations[i].coordinates[j][0];
      midpointLon += waterLocations[i].coordinates[j][1];
    }

    var locationType = waterLocations[i].locationType;
    var numCoordinates = waterLocations[i].coordinates.length;
    createWaterLocation(locationType, numCoordinates, midpointLat, midpointLon, i, tempCoords);

    //checks every shark to see if it is in the current water location
    for(let j = 0; j < sharkRecentCoords.length; j++) {
      //let sharkPoint = [sharkMovement.coordinates[0][0], sharkMovement.coordinates[0][1]];
      if(inside(sharkRecentCoords[j], checkCoords)) {
        alert("There is a shark in a protected area!");
      }
    }

  }

  //get current location
  locationWindow = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        new google.maps.Marker({
          position: pos,
          map,
          title: "Current Location",
        });
      },
      () => {
        handleLocationError(true, locationWindow, map.getCenter());
      },
    );
  } else {
    // Browser .getTime()doesn't support Geolocation
    handleLocationError(false, locationWindow, map.getCenter());
  }
}

function generateMovement(sharkMovement) {
  const currDate = new Date();
  let exit = false;

  while (!exit) {
    const milSecInDay = 86400000;
    const oldDate = new Date(sharkMovement.dateTime[0]);
    const changeInDays =  (currDate - oldDate)/milSecInDay;

    if (changeInDays >= 1) {
      // Generate a random number of milliseconds between 1 and 12 days
      //random * (range + 1) + min
      let randomMilliseconds = (1*milSecInDay) + (7*milSecInDay) * Math.random();
      const sameDay = Math.random() < 0.5;
      if (sameDay) {
        randomMilliseconds = randomMilliseconds % milSecInDay;
      }
      // Add random datetime to input date
      const newDate = new Date(oldDate.getTime() + randomMilliseconds);

      //don't know if need get time for comparison?
      if ((newDate/milSecInDay) < (currDate/milSecInDay)) {
          sharkMovement.dateTime.unshift(newDate.toLocaleString());
          //generate coordinates
          const [newLat, newLon] = addRandomizedDistanceToCoordinates(sharkMovement.coordinates, randomMilliseconds/milSecInDay)
          sharkMovement.coordinates.unshift([newLat, newLon]);
      } else {
        exit = true;
      }
    } else {
      exit = true;
    }
  }
  //save sharkmovement *NEED TO DO*
  return sharkMovement;
}

function getRandomDistance() {
  // Generate a random decimal between .25 and 1.25
  //random * (range + 1) + min
  let num = Math.random()/2;
  return num;
}

function addRandomizedDistanceToCoordinates(coordinates, days) {
  let newLatitude, newLongitude;
  do {
    const randomLatDist = getRandomDistance();
    const randomLonDist = getRandomDistance();
    let latDirection = 1;
    let lonDirection = 1;
    if (coordinates.length > 1) {
      latDirection = ((coordinates[0][0]-coordinates[1][0]) >= 0)? 1 : -1;
      lonDirection = ((coordinates[0][1]-coordinates[1][1]) >= 0)? 1 : -1;
    }
    //const turn = Math.random() < 0.25;
    if (rand = Math.random(), rand < 0.125) {
      latDirection = latDirection * -1;
    } else if (rand < 0.25) {
      lonDirection = lonDirection * -1;
    }
    newLatitude = coordinates[0][0] + (randomLatDist * days * latDirection);
    newLongitude = coordinates[0][1] + (randomLonDist * days * lonDirection);
  } while (!isItWater([newLatitude, newLongitude])); //check if coordinates are on water
  return [newLatitude, newLongitude];
}

function isItWater(coordinates) {
  let url = 'https://isitwater-com.p.rapidapi.com/?latitude='+coordinates[0]+'&longitude='+coordinates[1];
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b2c77fdf8bmsh72de867367cb798p1085ccjsn432b37279101',
      'X-RapidAPI-Host': 'isitwater-com.p.rapidapi.com'
    }
  };
  /* setTimeout(async function(){
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }, 1000); */

  return true;
}

function handleLocationError(browserHasGeolocation, locationWindow, pos) {
  locationWindow.setPosition(pos);
  locationWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  locationWindow.open(map);
}

//when a pin is clicked, changes from a pin to an infowindow
function toggleHighlight(markerView, property) {
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = null;
  } else {
    markerView.content.classList.add("highlight");
    markerView.zIndex = 1;
  }
}

//builds the actual html for the pins
function buildContent(property, species) {

  const content = document.createElement("div");
  content.className = "shark-pin";
  content.classList.add("properties");
  content.innerHTML = `
    <div class="icon">
      <img class="sharkFinIcon" src="/images/pins/sharkFin.png">
    </div>
    <div class="details">
      <div class="speciesName">Species: ${species.speciesName}</div>
      <div class="bloodType">Blood Type: ${species.bloodType}</div>
      <div class="binomialName">Scientific Name: ${species.binomialName}</div>
      <div class="speciesBio">${species.speciesBio}</div>
      <div class="age">Birthdate: ${property.age}</div>
      <button name="delete", id=${property.sharkID}>Delete Shark :(</button>
    </div>
    `;
  return content;
}

//creates the water shapes and markers for water locations
function createWaterLocation(locationType, numCoordinates, midpointLat, midpointLon, num, tempCoords) {
  var color;
  var locationString;
  var icon;
  //checks of location is a protected area or sanctuary
  if(locationType == "protected") {
    color = "#00FF00";
    locationString = "Protected Area";
    icon = "/images/pins/green-pin.png";
  } else {
    color = "#FFDB58 ";
    locationString = "Sanctuary";
    icon = "/images/pins/caution-pin2.png";
  }

  //make the location polygon
  const newLocation = new google.maps.Polygon({
    id: num,
    paths: tempCoords,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
  });

  newLocation.setMap(null);
  waterLocationArray[num] = newLocation;

  const midpointLatLon = new google.maps.LatLng(midpointLat/numCoordinates, midpointLon/numCoordinates);

  //make the midpoint markers
  const marker = new google.maps.Marker({
    map,
    location_id: num,
    waterLocationVisible: false,
    position: midpointLatLon,
    title: locationString,
    icon: icon
  });

  //add a listener to toggle the shape under the marker
  marker.addListener("click", () => {
    toggleWaterShape(marker);
  });

}

//when a water location pin is clicked, toggle the shape under it
function toggleWaterShape(markerView) {
  if (markerView.waterLocationVisible == true) {
    waterLocationArray[markerView.location_id].setMap(null);
    markerView.waterLocationVisible = false;
  } else if (markerView.waterLocationVisible == false){
    waterLocationArray[markerView.location_id].setMap(map);
    markerView.waterLocationVisible = true;
    //console.log(waterLocationArray[markerView.location_id])
  }
}

//adds a listener for the document that checks if the user clicks on a delete button
document.addEventListener('click', function(e){
  if(e.target.name =="delete"){
    //loop through all the sharks, deleting the one with an id matching the button clicked
    for(let i = 0; i < sharkData.length; i++){
      //console.log(sharkData[i].sharkID);
      if(sharkData[i].sharkID == e.target.id) {
        DataHandler.deleteShark(sharkData[i].sharkID);
      }
    }
  }
})

//function that checks if a point is inside a polygon
function inside(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];

      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }

  return inside;
};

window.initMap = initMap;
