"use strict";

// -- needed vars --
let apiKey = "582eaef8fa88ead22261302ca8720f2b";
let city = localStorage.getItem("city");

// -- Measurement Units --
// If preferred units are stored locally then use them, other wise default to metric
let units;
if (localStorage.getItem('units') != null) {units = localStorage.getItem('units');}
else {units = "metric";} 

// Determining symbol for specified unit above as well as speed specification (meters/sec etc.)
let unitSymbol;
let speedSpec;
if (units === "metric") {unitSymbol = "°C"; speedSpec = "meters/second";}
else if (units === "farenheit") {unitSymbol = "°F"; speedSpec = "miles/hour";}
else if (units === "standard") {unitSymbol = "K";}

// -- Inserting vars into url --
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

// -- Main function to get weather info and display it --
async function get_stat (url) {

	// -- Getting information from api (in order of use in document) --
	let response = await fetch(url);
	// let response = await fetch('/misc/test.json');

	if (response.status == 200) {
		let data = await response.json();
		
		// - Location Info Heading -
		let cityName = data['name'];
		let country = data['sys']['country'];

		// - Addtional Location Info Subheading -
		// Image based on weather description
		let weatherIcon = data['weather'][0]['icon'];
		let image = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

		let weatherDesc = data['weather'][0]['description'];
		// Fancy JS I found online that capitalizes the first letter of each word
		weatherDesc = weatherDesc.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

		// UTC Timezone
		let timezone = data['timezone'];
		timezone = timezone / 3600;
		if (timezone > 0) {timezone = `+${timezone}`;}

		// - Temp -
		let temp = data['main']['temp'];
		let feelsLike = data['main']['feels_like'];
		let tempHigh = data['main']['temp_max'];
		let tempLow = data['main']['temp_min'];
		let humidity = data['main']['humidity'];
		
		// Wind
		let windSpeed = data['wind']['speed'];
		let windDir = data['wind']['deg'];
		let windGust = data['wind']['gust'];

		// - Sunrise, Sunset -
		// Steps to format sunrise and sunset times to desired format
			// 1: Get raw unix time from api
			// 2: Convert to a js Date object by multiplying by 1000 and using the Date() function
			// 3: Using said object use built-in functions .getHours(), .getMinutes(), and .getSeconds() and store the results in vars
			// 4: If said vars are less than 10 append a 0 to the front of the var (beauty feature, looks weird without it)
			// 5: Assign the root var (sunrise, sunset) to each of the aforementioned vars combined into one string to be inserted in the document

		let sunrise = data['sys']['sunrise'];
		sunrise = new Date(sunrise * 1000);
		let sunriseHours = sunrise.getHours();
		let sunriseMinutes = sunrise.getMinutes();
		let sunriseSeconds = sunrise.getSeconds();
		if (sunriseHours < 10) {sunriseHours = "0" + sunriseHours;}
		if (sunriseMinutes < 10) {sunriseMinutes = "0" + sunriseMinutes;}
		if (sunriseSeconds < 10) {sunriseSeconds = "0" + sunriseSeconds;}
		sunrise = `${sunriseHours}:${sunriseMinutes}:${sunriseSeconds}`;

		let sunset = data['sys']['sunset'];
		sunset = new Date(sunset * 1000);
		let sunsetHours = sunset.getHours();
		let sunsetMinutes = sunset.getMinutes();
		let sunsetSeconds = sunset.getSeconds();
		if (sunsetHours < 10) {sunsetHours = "0" + sunsetHours;}
		if (sunsetMinutes < 10) {sunsetMinutes = "0" + sunsetMinutes;}
		if (sunsetSeconds < 10) {sunsetSeconds = "0" + sunsetSeconds;}
		sunset = `${sunsetHours}:${sunsetMinutes}:${sunsetSeconds}`;

		// - When data was calculated. ie. last updated -
		let lastUpdated = data['dt'];
		lastUpdated = new Date(lastUpdated * 1000);

		// -- Inserting returned values from api into document --
		
		// Updating title to include city name
		document.getElementById('title').innerHTML = `${cityName} | Weather Dashboard`;
		
		// Setting Heading and subheading on dashboard and imbedding image of weatherIcon
		document.getElementById('dashboard-heading').innerHTML = `${cityName}, ${country}`;
		document.getElementById('weatherDesc').innerHTML = `<img src="${image}" style="vertical-align:middle;" width="35px" height="35px" alt="visual representation of weather description">${weatherDesc} · UTC ${timezone}`;

		// Setting Temperatures
		document.getElementById('temp').innerHTML = `${temp} ${unitSymbol}`;
		document.getElementById('feelsLike').innerHTML = `${feelsLike} ${unitSymbol}`;
		document.getElementById('tempHigh').innerHTML = `${tempHigh} ${unitSymbol}`;
		document.getElementById('tempLow').innerHTML = `${tempLow} ${unitSymbol}`;
		document.getElementById('humidity').innerHTML = `${humidity}%`;

		// Setting Winds stats
		document.getElementById('windSpeed').innerHTML = `${windSpeed}`;
		document.getElementById('windGust').innerHTML = `${windGust}`;
		document.getElementById('windDir').innerHTML = `${windDir}°`;
		document.getElementById('speedSpec').innerHTML = `(${speedSpec})`;

		// Setting Sunrise & Sunset stats
		document.getElementById('sunrise').innerHTML = `${sunrise}`
		document.getElementById('sunset').innerHTML = `${sunset}`

		// Other info
		document.getElementById('lastUpdated').innerHTML = `🕑 Last Updated: ${lastUpdated}`;
	}
	
	// If response status is not 200 (OK) then show an error message and redirect to homepage
	else {
		// hide grid and show button saying city was set wrong
		document.getElementById("grid").style.display = "none";
		document.getElementById("weatherDesc").style.display = "none";
		document.getElementById('lastUpdated').style.display = "none";
		document.getElementById('dashboard-heading').style.color = "red";
		document.getElementById('dashboard-heading').style.textDecoration = "underline";
		document.getElementById('dashboard-heading').innerHTML = "Error, invalid city specified.";
		document.getElementById('invalid-wrapper').style.display = "flex";
		console.log(`Error! ${response.status}`);

		// Redirect counter 5 secs
		for (let i = 5; i > 0; i--) {
			document.getElementById('invalid-button').innerHTML = `<a href="../index.html">You will be redirected in ${i} seconds.</a>`;
			await new Promise(r => setTimeout(r, 1000));
		}

		document.location.href = "../../";
	}

}

// --- Function to toggle nav, invoked by hamburger button ---
function toggleNav() {
    let x = document.getElementById('nav');
    if ( window.getComputedStyle(x).getPropertyValue("display") === 'none') {
        x.style.display = 'flex';
    } else {
        x.style.display = 'none';
    }
  }

// --- Function to set units based on user input, invoked by button ---
function setUnits(units) {
   localStorage.setItem("units", units);
   alert(`Set ${units} as default unit.`);
 }
 
// --- Function to toggle nav, invoked by hamburger button ---
function toggleNav() {
	let x = document.getElementById('nav');
	if ( window.getComputedStyle(x).getPropertyValue("display") === 'none') {
		x.style.display = 'flex';
	} else {
		x.style.display = 'none';
	}
   }
 
// --- Only getting stats if on dashboard page ---
if (window.location.pathname === "/weather-dashboard/pages/dashboard/") {get_stat(url)}

// --- Service worker for PWA stuff ---

// Checkes if browser supports service worker, if so, it registers it
window.addEventListener('load', () => {
	if ('serviceWorker' in navigator) {
		// Using absolute path because it needs to be started on any page
	  navigator.serviceWorker.register('/weather-dashboard/service-worker.js');
	}
  });

// //  --- Notifications ---
// // Checking browser compatibility for notification api. If it does ask user to enable them.
// if ('Notification' in window && navigator.serviceWorker) {

// 	// All cases of user-set notification acess and what to do in each case.
// 	if (Notification.permission === "granted") {
// 		/* do our magic */
	

// 	  } else if (Notification.permission === "blocked") {
// 	   /* the user has previously denied push. Can't reprompt. */
// 	   console.log("Aw, shucks.");

// 	  } else {
// 		// show a prompt to the user
// 		Notification.requestPermission(function(status) {
// 			console.log('Notification permission status:', status);
// 		});
// 	  }
//   }

// // console.log(Notification.permission);

// function showNotification(i) {
// 	if (Notification.permission == 'granted') {
// 	  navigator.serviceWorker.getRegistration().then(function(reg) {
// 		var options = {
// 		  body: `${i}`,
// 		//   icon: 'images/example.png',
// 		//   vibrate: [100, 50, 100],
// 		//   data: {
// 			// dateOfArrival: Date.now(),
// 			// primaryKey: 1
// 		//   }
// 		};
// 		reg.showNotification('Hello world!', options);
// 		// setTimeout(async function () { await new Promise(r => setTimeout(r, 2000)); });
// 	  });
// 	}
//   }

// // displayNotification()


// // function showNotification(i) {
// // 	Notification.requestPermission(function(result) {
// // 	  if (result === 'granted') {
// // 		navigator.serviceWorker.ready.then(function(registration) {
// // 		  registration.showNotification('Vibration Sample', {
// // 			body: `${i}`,
// // 			vibrate: [200, 100, 200, 100, 200, 100, 200],
// // 			tag: 'vibration-sample'
// // 		  });
// // 		});
// // 	  }
// // 	});
// //   }

// let i = "drip";
// async function go(i) {
// 	i = "dog";
// 	showNotification(i);
// 	await new Promise(r => setTimeout(r, 7000));
// 	i = "cat";
// 	showNotification(i);
// }

// go();
/*
Working on implementing a notification system that sends the user a notification
of the weather every hour. Not sure how to do it yet. Using the showNotification
function works, but it does not repect the set timer async await function I
have setup,  figure it out :)
Update: just tried what I did on line 248 with an immediately invoked function
but that did not work either
Update 2: just read online that the await thing only sleeps code in ur function
and ig cus this is not in a fuction it just doesn't work.
Update 3: just tried the new function and it works, the only problem to solver
now is the issue of sending notifs when the tab is closed. ie using the service
worker or other background service to continually check and send notifs
aight i'm going to bed now
*/