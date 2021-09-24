"use strict"

// needed vars
let apiKey = "582eaef8fa88ead22261302ca8720f2b"
let city = localStorage.getItem("city");

// Measurement Units
let units
if (localStorage.getItem('units') != 'null')
{units = localStorage.getItem('units');}
else {units = "metric";} 

let unitSymbol;
if (units === "metric") {unitSymbol = "°C";}
else if (units === "farenheit") {unitSymbol = "°C";}
else if (units === "standard") {unitSymbol = "K";}

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
// document.getElementById('dashboard-greeting').innerHTML = city;


async function get_stat (url) {
	// GET http request
	// let response = await fetch('../test.json');
	let response = await fetch(url);

	if (response.status == 200) {
		let data = await response.json();
		
		let cityName = data['name'];
		let country = data['sys']['country'];
		
		let sunrise = data['sys']['sunrise'];
		sunrise = new Date(sunrise * 1000);

		let sunset = data['sys']['sunset'];
		sunset = new Date(sunset * 1000);

		let weatherDesc = data['weather'][0]['description'];
		
		let temp = data['main']['temp'];
		let feelsLike = data['main']['feels_like'];

		let tempHigh = data['main']['temp_max'];
		let tempLow = data['main']['temp_min'];

		let humidity = data['main']['humidity'];
		let windSpeed = data['wind']['speed'];

		// When data was calculated. ie. last updated
		let dt = data['dt'];
		dt = new Date(dt * 1000);

		// UTC Timezone
		let timezone = data['timezone'];
		timezone = timezone / 3600;
		if (timezone > 0) {timezone = `+ ${timezone}`;}

		// Changing values of many document elements

		// Changing H1 and subheading on dashboard
		document.getElementById('dashboard-greeting').innerHTML = cityName;
		document.getElementById('location-info').innerHTML = `${cityName}, ${country} | UTC ${timezone}`;
		
		// Updating title to include city name
		document.getElementById('title').innerHTML = `${cityName} | Weather Dashboard`;

		// Changing Temperatures
		document.getElementById('temp').innerHTML = `${temp} ${unitSymbol}`;
		document.getElementById('feelsLike').innerHTML = `Feels Like: ${feelsLike} ${unitSymbol}`;
		document.getElementById('tempHigh').innerHTML = `🔼 High: ${tempHigh} ${unitSymbol}`;
		document.getElementById('tempLow').innerHTML = `🔽 Low: ${tempLow} ${unitSymbol}`;

		console.log(data);
		console.log(cityName);
		console.log(sunrise);
		console.log(sunset);
		console.log(weatherDesc);
		console.log(country);
		console.log("sda")

	}
	else {
		// hide grid and show button saying city was set wrong
		document.getElementById("grid").style.display = "none";
		document.getElementById("location-info").style.display = "none";
		document.getElementById('dashboard-greeting').style.color = "red";
		document.getElementById('invalid-wrapper').style.display = "flex";
		document.getElementById('dashboard-greeting').innerHTML = "Error, invalid city specified.";
		console.log(`Error! ${response.status}`);

		// Redirect counter
		for (let i = 5; i > 0; i--) {
			document.getElementById('invalid-button').innerHTML = `<a href="../index.html">You will be redirected in ${i} seconds.</a>`;
			await new Promise(r => setTimeout(r, 1000));
		}

		document.location.href = "../index.html";
	}

}

get_stat(url);
