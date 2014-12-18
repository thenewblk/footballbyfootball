/**
 * @jsx React.DOM
 */

var React = require('react');

// var ReactScriptLoaderModule = require('../ReactScriptLoader.js');
// var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
// var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var util = require('util');

var myDropzone;

var imageUploader = React.createClass({
  

  // mixins: [ReactScriptLoaderMixin],

  getInitialState: function() {
    return {};
  },

  componentDidMount: function(){
    console.log('componentDidMount');
    var self = this;
    var image = this.props.image_url;
    if (!image) {
      console.log(' !image');
      Dropzone.autoDiscover = false;

      myDropzone = new Dropzone(".uploader", { url: "/upload", paramName: "file", maxFiles: 1, autoDiscover: false});

      myDropzone.on("success", function(file) {
        /* Maybe display some more file information on your page */
        var thing = JSON.parse(file.xhr.response);
        console.log('success: ' + thing.saved);
        self.props.content({image_url: "https://s3.amazonaws.com/footballbyfootball-dev"+thing.saved  });
      });
    }
  },

  // getScriptURL: function() {
  //   return '/js/dropzone.js';
  // },

  handleClose: function() {
    
    var self = this;
    self.props.removed({id: true});
  },

  // onScriptLoaded: function() {
  //   console.log('onScriptLoaded');
  //   var self = this;
  //   var image = this.props.image_url;
  //   if (!image) {
  //     console.log(' !image');
  //     Dropzone.autoDiscover = false;

  //     myDropzone = new Dropzone(".uploader", { url: "/upload", paramName: "file", maxFiles: 1, autoDiscover: false});

  //     myDropzone.on("success", function(file) {
  //       /* Maybe display some more file information on your page */
  //       var thing = JSON.parse(file.xhr.response);
  //       console.log('success: ' + thing.saved);
  //       self.props.content({image_url: "https://s3.amazonaws.com/footballbyfootball-dev"+thing.saved  });
  //     });
  //   }
  // },
 
  // onScriptError: function() {
  //     alert('Script Load Error');
  // },


  render: function() {



    var self = this;
    var image_url = self.props.image_url;
    if (!image_url) {
      console.log("no image_url");
    }

    return ( 
      <div className='content-container' ref='contentwrapper'>
        {image_url ?  
          <div className='uploaded-image'>
            <img src={"https://s3.amazonaws.com/footballbyfootball-dev"+image_url} />
            <a className="close-link" onClick={self.handleClose}>×</a>
          </div> 
        : 
          <div className='image-container'>
            <div className={"image-uploader-label image-uploader uploader"}>
              <p className="fa fa-image upload-icon label-copy"></p>
              <br />
              <p className="label-copy">Upload Image</p>
            </div>
          </div>
          
        }
      </div> )
  }
});

module.exports = imageUploader;