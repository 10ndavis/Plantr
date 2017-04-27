import React from 'react';
import { connect } from 'react-redux';
import {setGardenParameters, setGarden, undo, redo, clear, setHeight, setWidth} from '../Actions/GardenActions.js';
import axios from 'axios';
import GardenGrid from './GardenGrid.js';
import MySquare from './MySquare.js';
import Plant from './Plant.js';
import {Layer, Rect, Circle, Stage, Group} from 'react-konva';
import PlantShelf from './PlantShelf.js'
import CostEstimate from './CostEstimate.js';
import PlantGrid from './PlantGrid.js';
import querystring from 'querystring'
import MyRect from './MyRectangle.js'
import SeedPacket from '../SeedPacket/SeedPacket.js';
import HarvestGraph from '../Analytics/HarvestGraph.js';
import AnalyticsTabs from '../Analytics/AnalyticsTabs.js';
import PlantBreakdown from '../Analytics/PlantBreakdown.js';
import PlantDex from '../PlantDex/PlantDex.js'
import VRScene from '../AframeTest/VRScene.js'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import html2canvas from 'html2canvas';
import auth from '../client.js'







const MakeGardenSquareGridView = React.createClass({

  saveGarden(profilePicture, profileEmail, profileNickname, gardenName, zone) {
    console.log("Saving garden...")
      var myImage;
      html2canvas(document.body, {
      onrendered: function(canvas) {
              myImage = canvas.toDataURL("image/png");
              console.log("Here is your image");
            // window.open(myImage);
      }
    });



      console.log("myImage is! ", myImage)
    axios.post('/api/gardens',
      {
        gardenId: Math.random()*100,
        userId: Math.random()*100,
        gardenGrid: this.props.gardenGrid,
        plantGrid: this.props.plantGrid,
        profilePicture: profilePicture,
        profileEmail: profileEmail,
        profileNickname: profileNickname,
        gardenImage: myImage,
        gardenName: gardenName,
        hardinessZone: zone
      }
    ).then((res) => {
      console.log("Successful post");
    }).catch((err) => {
      console.error(err);
      console.log("Error in getGardenSquareGrid getAllGardens()")
    });
  },
  setHeight(e){
      let height = parseInt(e.target.value);
      this.props.dispatchSetHeight(height);
      console.log(this.props)
      this.props.dispatchSetGardenParameters(this.props.width, height);
  },

  setWidth(e){
      let width = parseInt(e.target.value);
      this.props.dispatchSetWidth(width);
      this.props.dispatchSetGardenParameters(width, this.props.height);
  },



  render () {
    let input;
    let width = 10;
    let height = 10;
    let color;
    let center = {
      textAlign: "center"
    };
    let gardenName;
    let profile = auth.getProfile();
    let profilePicture = profile.picture
    let profileEmail = profile.email;
    let profileNickname = profile.nickname

  if (false) {
    return <VRScene />
  } else {
   return (
      <div className="container" style={center}>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h1>Create a Garden</h1>
          </div>
        </div>
      <hr className="hrTwoD"/>
        <div className="row">
          <div className="col-md-3">
            Garden Height <br/>
            <span><strong>{this.props.width} ft</strong></span>
              <form action="#">
                <p className="range-field">
                  <input type="range" min="1" max="10" step="1" value={parseInt(this.props.width)} onChange={this.setWidth}/>
                </p>
              </form>
            Garden Width <br/>
            <span><strong>{this.props.height} ft</strong></span>
              <form action="#">
                <p className="range-field">
                  <input type="range"  min="1" max="14" step="1" value={this.props.height} onChange={this.setHeight}/>
                </p>
              </form>
             <input ref={(node) => gardenName = node } type="text" name="gardenName" placeholder='Name your new garden' required/>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  this.saveGarden(profilePicture, profileEmail, profileNickname, gardenName.value, this.props.zone);
                  }} type="submit">Submit Garden
                </button>
              <div id="seedHolder">
                <SeedPacket />
              </div>
              <div>
                <button onClick={() => {
                    this.props.dispatchUndo();}}>Undo</button>
                <button onClick={() => {
                    this.props.dispatchClear();}}>Clear</button>
                <button onClick={() => {
                    this.props.dispatchUndo();}}>Redo</button>
                <button onClick={() => {
                    this.props.dispatchClear();}}>Delete</button>
              </div>
              <div className="col-md-12 offset-md-1">
                <p>Harvest Graph</p>
                <HarvestGraph />
              </div>
          </div>

          <div className="col-md-8">
              <Stage id="cat" width={800} height={670} fill="white" stroke="black" className="gardenGrid">
                <GardenGrid />
                <PlantGrid />
                <Layer>
                  <PlantShelf />
                  <MyRect />
                </Layer>
              </Stage>
            <div className="col-md-12">
              <PlantDex />
            </div>
            <div className="col-md-12 AnalyticsTabs">
              <AnalyticsTabs />
            </div>
          </div>
        </div>

        <div className="row" style={center}>
        </div>
      </div>
    );
  }
}
});

const mapStateToProps = (state) => {
  return {
    gardenGrid: state.gardenReducer.gardenGrid,
    plantGrid: state.gardenReducer.plantGrid,
    width: state.gardenReducer.width,
    height: state.gardenReducer.height,
    tooltipOpen: state.gardenReducer.tooltipOpen,
    zone: state.weatherReducer.zone
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    dispatchSetGardenParameters(width, height, color) {
      dispatch(setGardenParameters(width, height, color));
    },
    dispatchSetGarden(dbGardenGrid) {
      dispatch(setGarden(dbGardenGrid));
    },
    dispatchSetHeight(height){
      dispatch(setHeight(height));
    },
    dispatchSetWidth(width){
      dispatch(setWidth(width));
    },
    dispatchUndo() {
      dispatch(undo());
    },
    dispatchRedo() {
      dispatch(redo());
    },
    dispatchClear() {
      dispatch(clear());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MakeGardenSquareGridView);