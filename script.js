document.addEventListener("DOMContentLoaded", function () {
  // Grab the JSON data from the api
  fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const forecasts = data.items[0].forecasts; //Grab the forecasts from the json data.

      //Grab date from forecast start time.
      const isoDate = data.items[0].valid_period.start;
      const formattedDate = dateFns.format(isoDate, "MM/dd/yyyy");
      document.getElementById("date").textContent = formattedDate;              //Display Date

      //Grab time and Format it using library
      const timeStart = data.items[0].valid_period.start;                       //Find Start Time
      const isoStartString = timeStart;
      const dateStart = dateFns.parseISO(isoStartString);
      const formattedStartTime = dateFns.format(dateStart, "h:mm a");


      const timeEnd = data.items[0].valid_period.end;                            //Find End Time
      const isoEndString = timeEnd;
      const dateEnd = dateFns.parseISO(isoEndString);
      const formattedEndTime = dateFns.format(dateEnd, "h:mm a");


      const formattedTime = formattedStartTime + " to " + formattedEndTime;      //Display Time
      document.getElementById("time").textContent = formattedTime;

      const select = document.getElementById("location");

      // Clear existing options
      select.innerHTML = "";

      // Using default value on startup
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "-- Select Location --";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      // Map each area available from response to the dropdownlist
      forecasts.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.area;
        option.textContent = item.area;
        select.appendChild(option);
      });

      document
        .getElementById("location")
        .addEventListener("change", function () {
          const selectedLocation = this.value; // gets the selected option's value
          console.log("Selected:", selectedLocation);

          // Find forecast for selected location
          const forecastData = forecasts.find(
            (item) => item.area === selectedLocation
          );

          if (forecastData) {
            // Display the selected forecast
            document.getElementById("forecastLocation").textContent =
              selectedLocation;
            document.getElementById("forecastResult").textContent =
              forecastData.forecast;

            // Set each type of forecast to a awesomefree font icon
            const forecast = forecastData.forecast;                               //Define forecast for switch statement
            let iconClass;                                                        //Create variable to store the font-awesome class name that we wanna use.
            switch (forecast) {
              case "Fair":
              case "Fair (Day)":
                iconClass = "fa-sun";
                break;
              case "Fair (Night)":
                iconClass = "fa-moon";
                break;
              case "Fair & Warm":
                iconClass = "fa-sun";
                break;
              case "Thundery Showers":
              case "Heavy Thundery Showers":
              case "Heavy Thundery Showers with Gusty Winds":
                iconClass = "fa-cloud-bolt";
                break;
              case "Showers":
              case "Heavy Showers":
              case "Light Showers":
              case "Light Rain":
              case "Passing Showers":
              case "Moderate Rain":
              case "Heavy Rain":
                iconClass = "fa-cloud-showers-heavy";
                break;
              case "Cloudy":
              case "Mist":
              case "Fog":
              case "Hazy":
              case "Slightly Hazy":
                iconClass = "fa-cloud";
                break;
              case "Windy":
                iconClass = "fa-wind";
                break;
              case "Partly Cloudy":
              case "Partly Cloudy (Day)":
                iconClass = "fa-cloud-sun";
                break;
              case "Partly Cloudy (Night)":
                iconClass = "fa-cloud-moon";
                break;
              default:
                iconClass = "fa-circle-question";
            }
            //Display the fontawesome icon based on case
            document.getElementById(
              "weatherIcon"
            ).className = `fa-solid ${iconClass} fa-5x mb-4`;
          }
        });
    })

    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.getElementById("forecastResult").textContent =
        "Failed to load data.";
    });
});
