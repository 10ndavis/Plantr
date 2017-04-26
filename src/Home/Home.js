import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { setCoordinates, setForecast } from '../Actions/WeatherActions.js';
import weatherReducer from '../reducers/WeatherReducer.js'
import LogoAnimation from './LogoAnimation'

var zipCode;

class Home extends Component {
  constructor() {
    super();
    this.state = {};
};

  setCoordinates(zipCode) {
    this.props.dispatchSetCoordinates(zipCode)
  }

  check() {
    var that = this;
    var latitudeLongitude;
    fetch("https://ipinfo.io/json")
      .then(res => res.json())
      .then(ip => {
          latitudeLongitude = ip.loc; //***Turns into ==> this.props.coordinates
      }).then(res => {
        let geocoder = new google.maps.Geocoder;
        let latlngStr = latitudeLongitude.split(',', 2);
        let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        return geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            let location = results[0]['formatted_address'].split(',');
            let diffLoc = location[location.length-2].split(' ');
            zipCode = diffLoc[diffLoc.length - 1];
            that.setCoordinates(zipCode);
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
      })
    })
  }

  componentDidMount() {
    this.check();
  }

 render() {
  let background = {
    marginTop: '10px',
    marginLeft: '10px',
    backgroundImage: 'url(https://static.pexels.com/photos/132957/pexels-photo-132957.jpeg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'fixed',
    backgroundSize: 'cover',
    borderRadius: '10px'
  };
  let color = {
    color: 'white',
    textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
  };
  let font = {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
  };
    return (
      <div>

        <video autoPlay loop muted id="videoBackground">
          <source src="https://www.videvo.net/app/stream.php?id=3698" type="video/mp4" />
        </video>



      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center logoHolder">
            <img src="/logo.png" height="180" width="380"/>
          </div>
        </div>
      <div className="row">
      <div className="col-md-10 offset-md-1 textHolder">
      <div className="videoText">Plantr is an online gardening and outdoor decor service, enabling people to create and plan their seasonal gardens based on regional variations and personal needs. Plantr was started by a group of passionate urban farmers looking to maximize their lots while incorporating the tech they use to help connect with their garden. It is through the passion of our users that Plantr is able to tell the story of who we are and how we connect with one another</div>

            </div>

          </div>

        </div>
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    messageToEdit: state.forumReducer.messageToEdit,
    posts: state.forumReducer.posts,
    currentPost: state.forumReducer.currentPost,
    editing: state.forumReducer.editing
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetCoordinates(coordinates){
      dispatch(setCoordinates(coordinates))
    },
    dispatchSetPost(message) {
      dispatch(setPosts(message));
    },
    dispatchSetEditing(editing) {
      dispatch(setEditing(editing));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
