(function() {
    'use strict';

    var injectedForecast = {
        "city": {
            "id": 1642911,
            "name": "Jakarta",
            "coord": {
                "lon": 106.845131,
                "lat": -6.21462
            },
            "country": "ID",
            "population": 0
        },
        "cod": "200",
        "message": 0.0204,
        "cnt": 7,
        "list": [{
                "dt": 1481601600,
                "temp": {
                    "day": 27,
                    "min": 26.31,
                    "max": 27,
                    "night": 26.31,
                    "eve": 27,
                    "morn": 27
                },
                "pressure": 1022.28,
                "humidity": 99,
                "weather": [{
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }],
                "speed": 2.59,
                "deg": 126,
                "clouds": 76,
                "rain": 1.69
            },
            {
                "dt": 1481688000,
                "temp": {
                    "day": 28.16,
                    "min": 26.04,
                    "max": 29.16,
                    "night": 26.63,
                    "eve": 27.62,
                    "morn": 26.04
                },
                "pressure": 1024.22,
                "humidity": 99,
                "weather": [{
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }],
                "speed": 1.47,
                "deg": 242,
                "clouds": 48,
                "rain": 8.11
            },
            {
                "dt": 1481774400,
                "temp": {
                    "day": 28.43,
                    "min": 25.57,
                    "max": 30.08,
                    "night": 27.7,
                    "eve": 30.08,
                    "morn": 25.57
                },
                "pressure": 1024.05,
                "humidity": 100,
                "weather": [{
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }],
                "speed": 1.51,
                "deg": 244,
                "clouds": 0,
                "rain": 4.3
            },
            {
                "dt": 1481860800,
                "temp": {
                    "day": 28.88,
                    "min": 25.74,
                    "max": 28.88,
                    "night": 25.74,
                    "eve": 26.77,
                    "morn": 26.45
                },
                "pressure": 1010.61,
                "humidity": 0,
                "weather": [{
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }],
                "speed": 4.04,
                "deg": 263,
                "clouds": 18,
                "rain": 8.28
            },
            {
                "dt": 1481947200,
                "temp": {
                    "day": 27.95,
                    "min": 25.27,
                    "max": 27.95,
                    "night": 25.27,
                    "eve": 25.77,
                    "morn": 25.99
                },
                "pressure": 1010.71,
                "humidity": 0,
                "weather": [{
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }],
                "speed": 5.39,
                "deg": 266,
                "clouds": 51,
                "rain": 8.83
            },
            {
                "dt": 1482033600,
                "temp": {
                    "day": 27.28,
                    "min": 25.19,
                    "max": 27.28,
                    "night": 25.19,
                    "eve": 25.78,
                    "morn": 25.4
                },
                "pressure": 1010.59,
                "humidity": 0,
                "weather": [{
                    "id": 502,
                    "main": "Rain",
                    "description": "heavy intensity rain",
                    "icon": "10d"
                }],
                "speed": 5,
                "deg": 272,
                "clouds": 40,
                "rain": 14.09
            },
            {
                "dt": 1482120000,
                "temp": {
                    "day": 27.81,
                    "min": 25.32,
                    "max": 27.81,
                    "night": 25.32,
                    "eve": 26.5,
                    "morn": 25.6
                },
                "pressure": 1010.29,
                "humidity": 0,
                "weather": [{
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }],
                "speed": 5.45,
                "deg": 266,
                "clouds": 49,
                "rain": 5.95
            }
        ]
    };

    var weatherAPIUrlBase = 'http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&cnt=7&APPID=94391138b18139a052b943e0b9d8f840';

    var app = {
        isLoading: true,
        visibleCards: {},
        selectedCities: [],
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main'),
        addDialog: document.querySelector('.dialog-container'),
        daysOfWeek: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        iconKey: {
            '01': 'clear',
            '02': 'cloudy-sunny',
            '03': 'partly-cloudy',
            '04': 'cloudy',
            '09': 'cloudy-scattered-showers',
            '10': 'rain',
            '11': 'thunderstorms',
            '13': 'snow',
            '50': 'fog',
        },
    };


    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    /* Event listener for refresh button */
    document.getElementById('butRefresh').addEventListener('click', function() {
        app.updateForecasts();
    });

    /* Event listener for add new city button */
    document.getElementById('butAdd').addEventListener('click', function() {
        // Open/show the add new city dialog
        app.toggleAddDialog(true);
    });

    /* Event listener for add city button in add city dialog */
    document.getElementById('butAddCity').addEventListener('click', function() {
        var select = document.getElementById('selectCityToAdd');
        var selected = select.options[select.selectedIndex];
        var id = selected.value;
        var label = selected.textContent;
        app.getForecast(id, label);
        app.selectedCities.push({ id: id, label: label });
        app.saveSelectedCities();
        app.toggleAddDialog(false);
    });

    /* Event listener for cancel button in add city dialog */
    document.getElementById('butAddCancel').addEventListener('click', function() {
        app.toggleAddDialog(false);
    });


    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new city dialog.
    app.toggleAddDialog = function(visible) {
        if (visible) {
            app.addDialog.classList.add('dialog-container--visible');
        } else {
            app.addDialog.classList.remove('dialog-container--visible');
        }
    };

    // Updates a weather card with the latest weather forecast. If the card
    // doesn't already exist, it's cloned from the template.
    app.updateForecastCard = function(data) {
        var card = app.visibleCards[data.id];
        if (!card) {
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = data.label;
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[data.id] = card;
        }

        var today_id = new Date().getDay();
        var today_data = data.list[today_id];
        var today_icon_code = today_data.weather[0].icon.substr(0, 2);
        var today_icon = app.iconKey[today_icon_code];

        // Verify data is newer than what we already have, if not, bail.
        var dateElem = card.querySelector('.date');
        if (dateElem.getAttribute('data-dt') >= today_data.dt) {
            return;
        }

        dateElem.setAttribute('data-dt', today_data.dt);
        dateElem.textContent = new Date(today_data.dt * 1000);
        card.querySelector('.description').textContent = data.city.name;
        card.querySelector('.current .icon').classList.add(today_icon);
        card.querySelector('.current .temperature .value').textContent =
            Math.round(today_data.temp.day);
        card.querySelector('.current .pressure').textContent =
            Math.round(today_data.pressure) + ' hpa';
        card.querySelector('.current .humidity').textContent =
            Math.round(today_data.humidity) + ' %';
        card.querySelector('.current .wind .value').textContent =
            Math.round(today_data.speed);
        card.querySelector('.current .wind .direction').textContent =
            today_data.deg;


        var nextDays = card.querySelectorAll('.future .oneday');
        var today = new Date();
        today = today.getDay();
        for (var i = 0; i < 7; i++) {
            var daily_data = data.list[i];
            var nextDay = nextDays[i];
            var daily_icon_code = daily_data.weather[0].icon.substr(0, 2);
            var daily_icon = app.iconKey[daily_icon_code];

            nextDay.querySelector('.date').textContent =
                app.daysOfWeek[i];
            nextDay.querySelector('.icon').classList.add(daily_icon);
            nextDay.querySelector('.temp-high .value').textContent =
                Math.round(daily_data.temp.max);
            nextDay.querySelector('.temp-low .value').textContent =
                Math.round(daily_data.temp.min);
        }


        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };


    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/

    app.createCORSRequest = function(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }

    // Gets a forecast for a specific city and update the card with the data
    app.getForecast = function(id, label) {
        var url = weatherAPIUrlBase + '&id=' + id;
        if ('caches' in window) {
            caches.match(url).then(function(response) {
                if (response) {
                    response.json().then(function(json) {
                        json.id = id;
                        json.label = label;
                        app.updateForecastCard(json);
                    });
                }
            });
        }
        // Make the XHR to get the data, then update the card
        var request = app.createCORSRequest('GET', url);
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    response.id = id;
                    response.label = label;
                    app.updateForecastCard(response);
                }
            }
        };
        request.send();
    };

    // Iterate all of the cards and attempt to get the latest forecast data
    app.updateForecasts = function() {
        var ids = Object.keys(app.visibleCards);
        ids.forEach(function(id) {
            app.getForecast(id);
        });
    };

    app.saveSelectedCities = function() {
        window.localforage.setItem('selectedCities', app.selectedCities);
    };

    document.addEventListener('DOMContentLoaded', function() {
        window.localforage.getItem('selectedCities', function(err, cityList) {
            if (cityList) {
                app.selectedCities = cityList;
                app.selectedCities.forEach(function(city) {
                    app.getForecast(city.id, city.name);
                });
            } else {
                app.updateForecastCard(injectedForecast);
                app.selectedCities = [
                    { id: injectedForecast.city.id, label: injectedForecast.city.name }
                ];
                app.saveSelectedCities();
            }
        });
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });
    }

})();