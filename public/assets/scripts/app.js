(function() {
    'use strict';

    var injectedForecast = {
        "id": "1047286",
        "label": "Bogor",
        "query": {
            "results": {
                "channel": {
                    "units": {
                        "distance": "km",
                        "pressure": "mb",
                        "speed": "km/h",
                        "temperature": "C"
                    },
                    "title": "Yahoo! Weather - Bogor, West Java, ID",
                    "link": "http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-1047286/",
                    "description": "Yahoo! Weather for Bogor, West Java, ID",
                    "language": "en-us",
                    "lastBuildDate": "Sat, 17 Dec 2016 10:30 PM WIB",
                    "ttl": "60",
                    "location": {
                        "city": "Bogor",
                        "country": "Indonesia",
                        "region": " West Java"
                    },
                    "wind": {
                        "chill": "73",
                        "direction": "180",
                        "speed": "6.44"
                    },
                    "atmosphere": {
                        "humidity": "86",
                        "pressure": "32746.39",
                        "rising": "0",
                        "visibility": "25.91"
                    },
                    "astronomy": {
                        "sunrise": "5:34 am",
                        "sunset": "6:5 pm"
                    },
                    "image": {
                        "title": "Yahoo! Weather",
                        "width": "142",
                        "height": "18",
                        "link": "http://weather.yahoo.com",
                        "url": "http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif"
                    },
                    "item": {
                        "title": "Conditions for Bogor, West Java, ID at 09:00 PM WIB",
                        "lat": "-6.59076",
                        "long": "106.792252",
                        "link": "http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-1047286/",
                        "pubDate": "Sat, 17 Dec 2016 09:00 PM WIB",
                        "condition": {
                            "code": "26",
                            "date": "Sat, 17 Dec 2016 09:00 PM WIB",
                            "temp": "22",
                            "text": "Cloudy"
                        },
                        "forecast": [{
                                "code": "4",
                                "date": "17 Dec 2016",
                                "day": "Sat",
                                "high": "23",
                                "low": "21",
                                "text": "Thunderstorms"
                            },
                            {
                                "code": "39",
                                "date": "18 Dec 2016",
                                "day": "Sun",
                                "high": "24",
                                "low": "20",
                                "text": "Scattered Showers"
                            },
                            {
                                "code": "47",
                                "date": "19 Dec 2016",
                                "day": "Mon",
                                "high": "24",
                                "low": "21",
                                "text": "Scattered Thunderstorms"
                            },
                            {
                                "code": "28",
                                "date": "20 Dec 2016",
                                "day": "Tue",
                                "high": "27",
                                "low": "21",
                                "text": "Mostly Cloudy"
                            },
                            {
                                "code": "28",
                                "date": "21 Dec 2016",
                                "day": "Wed",
                                "high": "27",
                                "low": "21",
                                "text": "Mostly Cloudy"
                            },
                            {
                                "code": "26",
                                "date": "22 Dec 2016",
                                "day": "Thu",
                                "high": "26",
                                "low": "21",
                                "text": "Cloudy"
                            },
                            {
                                "code": "26",
                                "date": "23 Dec 2016",
                                "day": "Fri",
                                "high": "26",
                                "low": "21",
                                "text": "Cloudy"
                            },
                            {
                                "code": "28",
                                "date": "24 Dec 2016",
                                "day": "Sat",
                                "high": "25",
                                "low": "21",
                                "text": "Mostly Cloudy"
                            },
                            {
                                "code": "47",
                                "date": "25 Dec 2016",
                                "day": "Sun",
                                "high": "23",
                                "low": "21",
                                "text": "Scattered Thunderstorms"
                            },
                            {
                                "code": "12",
                                "date": "26 Dec 2016",
                                "day": "Mon",
                                "high": "23",
                                "low": "21",
                                "text": "Rain"
                            }
                        ],
                    }
                }
            }
        }
    };


    var weatherAPIUrlBase = 'https://query.yahooapis.com/v1/public/yql';
    var extraParam = '?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%20{0}%20and%20u%3D%27c%27&format=json';

    //var weatherAPIUrlBase = 'http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&cnt=7&APPID=94391138b18139a052b943e0b9d8f840';

    var app = {
        isLoading: true,
        visibleCards: {},
        selectedCities: [],
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main'),
        addDialog: document.querySelector('.dialog-container'),
        iconKey: {
            '4': 'thunderstorm',
            '30': 'partly-cloudy',
            '10': 'rain',
            '11': 'rain',
            '16': 'snow',
            '20': 'fog',
            '24': 'wind',
            '26': 'cloudy',
            '27': 'cloudy',
            '28': 'cloudy',
            '29': 'cloudy',
            '30': 'cloudy',
            '32': 'clear',
            '33': 'cloudy-sunny',
            '34': 'cloudy-sunny',
            '36': 'clear',
            '37': 'cloudy-scattered-showers',
            '38': 'cloudy-scattered-showers',
            '39': 'cloudy-scattered-showers',
            '40': 'cloudy-scattered-showers',
            '47': 'thunderstorm',
        },
    };



    /*****************************************************************************
     *
     * Helpers
     *
     ****************************************************************************/

    String.prototype.format = function() {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
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
        data.query.results.channel.id = data.id;
        data.query.results.channel.label = data.label;

        var data = data.query.results.channel;
        if (data.id == null) {
            console.log("cannot find ID !");
            return;
        }

        var card = app.visibleCards[data.id];
        if (!card) {
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = data.location.city + ', ' + data.location.country;
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[data.id] = card;
        }

        var card_timestamp = (new Date("Sat, 17 Dec 2016 10:30 PM").getTime() / 1000);
        var today_icon_code = data.item.condition.code;
        var today_icon = app.iconKey[today_icon_code];

        // Verify data is newer than what we already have, if not, bail.
        var dateElem = card.querySelector('.date');
        if (dateElem.getAttribute('data-dt') >= card_timestamp) {
            return;
        }

        dateElem.setAttribute('data-dt', card_timestamp);
        dateElem.textContent = data.lastBuildDate;
        card.querySelector('.description').textContent = data.description;
        card.querySelector('.current .icon').classList.add(today_icon);
        card.querySelector('.current .temperature .value').textContent =
            Math.round(data.item.condition.temp);
        card.querySelector('.current .pressure').textContent =
            Math.round(data.atmosphere.pressure) + ' ' + data.units.pressure;
        card.querySelector('.current .humidity').textContent =
            Math.round(data.atmosphere.humidity) + ' %';
        card.querySelector('.current .wind .value').textContent =
            Math.round(data.wind.speed);
        card.querySelector('.current .wind .scale').textContent =
            data.units.speed;
        card.querySelector('.current .wind .direction').textContent =
            data.wind.direction;

        var nextDays = card.querySelectorAll('.future .oneday');
        var today = new Date();
        today = today.getDay();
        for (var i = 0; i < 7; i++) {
            var daily_data = data.item.forecast[i + 1];
            var nextDay = nextDays[i];
            var daily_icon_code = daily_data.code;
            var daily_icon = app.iconKey[daily_icon_code];

            nextDay.querySelector('.date').textContent =
                daily_data.day;
            nextDay.querySelector('.icon').classList.add(daily_icon);
            nextDay.querySelector('.temp-high .value').textContent =
                Math.round(daily_data.high);
            nextDay.querySelector('.temp-low .value').textContent =
                Math.round(daily_data.low);
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
        var url = weatherAPIUrlBase + extraParam.format(id);
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
        // var request = new XMLHttpRequest();
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
        request.open('GET', url);
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
                    app.getForecast(city.id, city.label);
                });
            } else {
                app.updateForecastCard(injectedForecast);
                app.selectedCities = [
                    { id: injectedForecast.query.results.channel.id, label: injectedForecast.query.results.channel.location.city }
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