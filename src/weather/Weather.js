import React from 'react';
// import './App.css';
import { connect } from 'react-redux'
import { updateWeather } from '../Actions/WeatherActions.js';
import weatherReducer from '../reducers/WeatherReducer.js'
import CloudAnimation from './CloudAnimation'
//take off class names if using CloudAnmiation and homemade animations

const WUNDERGROUND_KEY = "b56f2c0800fdf6e4";

const ICON_SET = {
    chancesleet: "snowy",
    chancesnow: "snowy",
    clear: "sunny",
    flurries: "snowy",
    fog: "cloudy",
    hazy: "cloudy",
    rain: "rainy",
    chancerain: "rainy",
    sleet: "snowy",
    snow: "snowy",
    chanceflurries: "snowy",
    tstorms: "stormy",
    chancetstorms: "stormy",
    sunny: "sunny",
    mostlysunny: "sunny",
    partlysunny: "sunny",
    partlycloudy: "cloudy",
    mostlycloudy: "cloudy",
    cloudy: "cloudy"
};

const SUPPORTED_LANGUAGES = [
    "AF", "AL", "AR", "HY", "AZ",
    "EU", "BY", "BU", "LI", "MY",
    "CA", "CN", "TW", "CR", "CZ",
    "DK", "DV", "NL", "EN", "EO",
    "ET", "FA", "FI", "FR", "FC",
    "GZ", "DL", "KA", "GR", "GU",
    "HT", "IL", "HI", "HU", "IS",
    "IO", "ID", "IR", "IT", "JP",
    "JW", "KM", "KR", "KU", "LA",
    "LV", "LT", "ND", "MK", "MT",
    "GM", "MI", "MR", "MN", "NO",
    "OC", "PS", "GN", "PL", "BR",
    "PA", "RO", "RU", "SR", "SK",
    "SL", "SP", "SI", "SW", "CH",
    "TL", "TT", "TH", "TR", "TK",
    "UA", "UZ", "VU", "CY", "SN",
    "JI", "YI"
];

function getIcon(icon) {
    return ICON_SET[icon];
}

function getTemp (text) {
    return (text.match(/(\-?[0-9]+)/) || [])[1];
}


class Weather extends React.Component {

  constructor (props) {
      super(props);
      this.state = {};

      var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
      };

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
              this.setState({
                  coordinates: pos.coords
              });
              //***Turns into ==> this.dispatchSetCoordinates(pos.coords)

              this.check();
          }, () => {
              this.check();
          }, options);
      }

      this.check();

      setInterval(() => this.check(), 10 * 60 * 1000);
  }

  check () {
      fetch("https://ipinfo.io/json")
        .then(res => res.json())
        .then(ip => {
            let lang = ip.country;
            if (!SUPPORTED_LANGUAGES.includes(lang)) {
                lang = "EN";
            }
            let crd = this.state.coordinates; //***Turns into ==> this.props.coordinates
            crd = crd || {
                latitude: +ip.loc.split(",")[0]
              , longitude: +ip.loc.split(",")[1]
            }
            const query = [crd.latitude, crd.longitude].join(",");
            const WUNDERGROUND_URL = `https://api.wunderground.com/api/${WUNDERGROUND_KEY}/forecast/lang:${lang}/q/${query}.json`;
            return fetch(WUNDERGROUND_URL)
        })
        .then(c => c.json())
        .then(forecast => {
            this.setState({
                forecast: forecast
            });

          //***Turns into ==> this.dispatchSetForecast(forecast);
        });
  }

  renderWeatherToday () {
      const today = this.state.forecast.forecast.txt_forecast.forecastday[0];
      //***Turns into this.props.forecast.forecast.txt_forecast.forecastday[0]
      const temp = getTemp(today.fcttext_metric);


      let icon = getIcon(today.icon);
      let hours = new Date().getHours();
      if ((icon === "sunny" || icon === "clear") && (hours > 20 || hours < 7)) {
          icon = "starry";
      }


      if (temp) {
          var tempElm = <div className="big-temp">{temp}</div>;
      }

      return (
          <div className="weather-today">
            <div className="icon-wrapper">
                <div className={`icon-big ${icon}`}>
                </div>
                {tempElm}
            </div>
            <p className="icon-description">{today.fcttext_metric}</p>
          </div>
      );
  }

  renderDay (day, index) {
      const temp = getTemp(day.fcttext_metric);
      if (temp) {
          var tempElm = <div className="small-temp">{temp}</div>;
      }

      return (
            <div className="day" key={index}>
                <div className="day-description">
                    {day.fcttext_metric}
                </div>
                <div className="icon-wrapper">
                    <div className={`icon-small ${getIcon(day.icon)}`}>
                    </div>
                    {tempElm}
                </div>
            </div>
      );
  }

  renderNextDays () {
      const nextDays = []
          , data = this.state.forecast.forecast.txt_forecast.forecastday;
          //***Turns into this.props.forecast.forecast.txt_forecast.forecastday


      for (var i = 2; i < data.length; i += 2) {
        nextDays.push(data[i])
      }

      return (
          <div className="weather-next-days">
            {nextDays.map((c, i) => this.renderDay(c, i))}
          </div>
      );
  }

  renderWeather () {
      if (!this.state.forecast) {
      //***Turns into if (!this.props.forecast) {
          return (
            <div className="weather-container">
                <p>Loading...</p>
            </div>
          );
      }
      return (
        <div className="weather-container">
            {this.renderWeatherToday()}
            {this.renderNextDays()}
        </div>
      );
  }

  render() {
    return (
        <div>
            <div className="app">
                {this.renderWeather()}
            </div>
            <div>
              <CloudAnimation />
            </div>
        </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
  //garden state
  temp_f: state.weatherReducer.temp_f,
  temp_c: state.weatherReducer.temp_c,
  weather_period_0: state.weatherReducer.weather_period_0,
  weather_period_1: state.weatherReducer.weather_period_1,
  weather_period_2: state.weatherReducer.weather_period_2,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
     dispatchUpdateWeather(weather) {
      dispatch(updateWeather(weather))
    },

    dispatchSetCoordinates(coordinates){
      dispatch(setCoordinates(coordinates))
    },

    dispatchSetForecast(forecast){
      dispatch(setForecast(forecast))
    }

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Weather);

// export default Weather;
