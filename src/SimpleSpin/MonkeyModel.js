import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import OBJLoader from 'three-obj-loader'
OBJLoader(THREE);
import MTLLoader from 'three-mtl-loader'
import ColladaLoader from 'three-collada-loader';



              // var jsonLoader = new THREE.JSONLoader()
              // jsonLoader.load("https://s3-us-west-2.amazonaws.com/ryaperry-bucket/monkey.json", function(jsonResponse){
              //   console.log("jsonResponse Loader loded successfully !!!!!", jsonResponse)

              //   console.log("Resulting JSON!!!!! ", jsonResponse)

              // var objLoader = new THREE.ObjectLoader();
              // loader.load("https://s3-us-west-2.amazonaws.com/ryaperry-bucket/monkey.json", function( obj ){
              //   console.log("inside of obj json loader: ", obj);
              //   // scene.add( obj );
              // });

                // objLoader.setPath("https://s3-us-west-2.amazonaws.com/ryaperry-bucket/");
                // objLoader.load("https://s3-us-west-2.amazonaws.com/ryaperry-bucket/monkey2.json", object => {
                //     console.log("in object", object)
                //   }
                // )

                // dae.traverse(function(child){
                //   if (child.colladaId == "Suzanne"){
                //       // child.traverse(function(e){
                //       //     e.castShadow = true;
                //       //     e.receiveShadow = true;
                //           // if(e.material instanceof THREE.MeshPhongMaterial){
                //           //     e.material.needsUpdate = true;
                //           //     console.log("e.material in travers", e.material)
                //           // }
                //       // })
                //       scene.add(child);
                //   }

                //   else if ( child. colladaId == "Plane"){
                //       // child.traverse(function(e){
                //       //     e.castShadow = true;
                //       //     e.receiveShadow = true;
                //       // })
                //       console.
                //   }
                // })

                // dae.updateMatrix()
                // console.log("dae children of 2: ", dae.children[2])
                // var child = dae.children[2]
                // child.children[0].scale.set(30,30,30)
                // scene.add(child)
              // })



    // console.log("REFS ============", this.refs);
    // const composer = new EffectComposer(react3, camera)
    // console.log("Composer: ", composer);
    // composer.addPass(new EffectComposer.RenderPass(scene, camera))

    //     // Redraw with a shader
    // const effect = new EffectComposer.ShaderPass(THREE.DotScreenShader);
    // composer.addPass(effect);
    // console.log("Composer2: ", composer);



















class MonkeyModel extends React.Component {
  // static propTypes = {
  //   width: React.PropTypes.number.isRequired,
  //   height: React.PropTypes.number.isRequired,
  //   color: React.PropTypes.string.isRequired,
  // };
  constructor(props, context) {
    super(props, context);

    this.loadThing = this.loadThing.bind(this);

  }

  loadThing(){
    const PATH = "https://s3-us-west-2.amazonaws.com/ryaperry-bucket/"
    // const MTL_FILE = "demo.mtl"
    // const OBJ_FILE = "demo.obj"

    const MTL_FILE = this.props.mtlFile
    const OBJ_FILE = this.props.objFile
    // const MTL_FILE = "VG14_7.mtl"
    // const OBJ_FILE = "VG14_7.obj"

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };
    var onError = function ( xhr ) {
      console.log("error", xhr)
    };

    var colladaLoader = new ColladaLoader()
    colladaLoader.options.convertUpAxis = true;
    colladaLoader.load("https://s3-us-west-2.amazonaws.com/ryaperry-bucket/monkey.dae", function(collada){
      console.log("collada Loader loded successfully !!!!!", collada)
      dae = collada.scene;
      dae.scale.x = dae.scale.y = dae.scale.z = 300

      dae.traverse(function(child){
        if (child.colladaId == "Suzanne"){
            child.traverse(function(e){
                e.castShadow = true;
                e.receiveShadow = true;
                // if(e.material instanceof THREE.MeshPhongMaterial){
                //     e.material.needsUpdate = true;
                //     console.log("e.material in travers", e.material)
                // }
            })
        }

        else if ( child. colladaId == "Plane"){
            child.traverse(function(e){
                e.castShadow = true;
                e.receiveShadow = true;
            })
        }
      })

      dae.updateMatrix()
    })

    // const mtlLoader = new MTLLoader();
    // mtlLoader.setBaseUrl(PATH);
    // mtlLoader.setPath(PATH); // One of these might not be needed
    // mtlLoader.crossOrigin = '*'; // Use as needed
    // mtlLoader.load(MTL_FILE, materials => {
    //     console.log("in materieassls", materials)
    //     materials.preload();
    //     // OBJ Loader
    //     console.log("materials after preload: " , materials)
    //     const objLoader = new THREE.OBJLoader();
    //     console.log("Objloader before setting materials: ", objLoader)
    //     // objLoader.setMaterials(materials);
    //     console.log("Objloader after setting materials: ", objLoader)
    //     objLoader.setPath(PATH);
    //     objLoader.load(OBJ_FILE, object => {
    //         console.log("in object", object)
    //         object.scale.set(70, 70, 70);
    //         // object.position.set(
    //         //   0,
    //         //   0,
    //         //   0)
    //        object.position.set(
    //           this.props.position.x,
    //           this.props.position.y,
    //           this.props.position.z
    //         )

    //         // for(let child of object.children) {
    //         //     console.log("looking at the children of object", child);
    //         //     // child.material.side = THREE.DoubleSide
    //         // }

    //         var that = this

    //         object.traverse( function ( child ) {
    //           console.log("traversing children ", child)
    //           if ( child instanceof THREE.Mesh ) {
    //             console.log("child thats a mesh! ", child)
    //             console.log("that inside of the object travers for the plant model: ", that)
    //             child.rotation.set(
    //               that.props.rotation.x,
    //               that.props.rotation.y,
    //               that.props.rotation.z
    //             )
    //             // var loader = new THREE.TextureLoader();
    //             // loader.crossOrigin = '*'; // Use as needed
    //             // var imgTexture = loader.load('https://s3-us-west-2.amazonaws.com/ryaperry-bucket/firstUVLayoutHouse.png');
    //             // child.material.map = imgTexture
    //             // // child.material.side = THREE.BackSide

    //           }
    //         });

    //         console.log("this is the object", object);
    //         console.log("before: this is the object that is binded to this", this);
    //         this.refs.plantModelGroup.add(object);
    //         console.log("after: this is the object that is binded to this", this);

    //     }, onProgress, onError);
    // });
  }

  componentDidMount(){
    this.loadThing();
    console.log("logging this in the comoponentDidMount", this)
  }

  render() {
    return (
      <div><h2>TESTING ColladaLoader</h2></div>
    );
  }
}
export default MonkeyModel;