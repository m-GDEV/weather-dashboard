let apiKey = "582eaef8fa88ead22261302ca8720f2b"
let city = "toronto"

let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Booo");
});
