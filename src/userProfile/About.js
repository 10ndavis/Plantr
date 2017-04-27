import React, { Component } from 'react';
import axios from 'axios';
import auth from '../client.js';

let userAboutObject = {};
class About extends Component {
  constructor() {
    super()
    this.state = {
      edit: false
    }
  }

  toggleState() {
    this.setState({edit: !this.state.edit});
  }

  setAbout(id, about) {
    axios.put('api/users/' + id + '/', {
      id: id,
      about: about
    }).then((res) => {
      console.log("Successfully posted your AboutMe! ", res.data);
      this.toggleState();
      this.getAbout();
    }).catch((err) => {
      console.error("Error in submitting your AboutMe - About.js: ", err);
    });
  }

  getAbout() {
    const profile = auth.getProfile();
    axios.get('api/users/:' + profile.clientID)
    .then((res) => {
      res.data.forEach((user) => {
        console.log('HERE IS THE USER IN THE GET :', user);
        if (user.email === profile.email) {
          userAboutObject = {
            id: user._id,
            about: user.about
          }
        }
      });
      console.log('successfully getting the user information in AboutJS', res.data)
    }).catch((err) => {
      console.error('there has been an error in rendering your AboutMe: ', err);
    });
  }

  componentDidMount() {
    this.getAbout();
  }

  render() {
    const profile = auth.getProfile();
    let that = this;
    let newMessage;
    return (
      <div className="row userAboutMe">
        <div className="col-md-12 about">
          <div> About Me </div>
          <div>
          { (function() {
            if (userAboutObject.about && that.state.edit) {
              return <div>
                <textarea className="textArea" rows="4" ref={(message) => newMessage = message } type="string" name="newMessage" defaultValue={JSON.parse(userAboutObject.about)}>
                </textarea>
                <button type="submit" onClick ={ () => {
                  newMessage.value = JSON.stringify(newMessage.value);
                  that.setAbout(userAboutObject.id, newMessage.value);
                  newMessage.value = '';
                }}>submit</button>
            </div>
            } else if (userAboutObject.about && !that.state.edit) {
              return <div>
                <p>{userAboutObject.about}</p>
                <button type="submit" onClick ={ () => {
                  that.toggleState();
              }}>edit</button>
            </div>
            } else {
              return <div>
                <textarea className="textArea" rows="4" ref={(message) => newMessage = message } type="string" name="newMessage" placeholder='Who knows you better than yourself?'>
                </textarea>
                <button type="submit" onClick ={ () => {
                  newMessage.value = JSON.stringify(newMessage.value);
                  that.setAbout(userAboutObject.id, newMessage.value);
                  newMessage.value = '';
                }}>submit</button>
              </div>
            }
          }())
          }
          </div>
        </div>
      </div>
      )
  }
}


export default About;