/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('../ReactScriptLoader.js');
var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var util = require('util');

var myDropzone = [];

var imageUploader = React.createClass({
  

  mixins: [ReactScriptLoaderMixin],

  getInitialState: function() {
    return {active: false, image_removed: false };
  },

  handleChange: function(event) {
  },

  handleCaptionChange: function(event) {
    this.props.caption_content({id: this.props.identifier, caption: event.target.value });
  },

  handleClose: function() {
    
    var self = this;
    self.props.removed({id: self.props.identifier});

    self.setState({active: false});

  },

  getScriptURL: function() {
    return '/js/dropzone.js';
  },

  onScriptLoaded: function() {
    var self = this;
    var image = this.props.image;
    if (!image) {
      console.log('onScriptLoaded: '+ self.props.identifier);

      Dropzone.autoDiscover = false;

      myDropzone[self.props.identifier] = new Dropzone(".uploader-"+self.props.identifier, { url: "/upload", paramName: "file", maxFiles: 1, autoDiscover: false});

      myDropzone[self.props.identifier].on("success", function(file) {
        /* Maybe display some more file information on your page */
        var thing = JSON.parse(file.xhr.response);
        console.log('success: ' + thing.saved);
        self.props.content({id: self.props.identifier, image_url: thing.saved  });
        self.setState({ active: true });
      });
    }
  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  theValue: function (){
  },

  render: function() {



    var self = this;
    var image = self.props.image,
        active = self.state.active,
        caption = self.props.caption;

    console.log('main image: '+JSON.stringify(image));

    var className = image || active ? 'content-container active' : 'content-container';

    return ( 
      <div className={className} ref='contentwrapper'>
        {self.props.image ?  
          <div className='uploaded-image'>
            <img src={"https://s3.amazonaws.com/footballbyfootball-dev"+self.props.image} />
          </div> 
        : 
          <div className='image-container'>
            <div className={"image-uploader-label image-uploader uploader-"+self.props.identifier}>
              <p className="fa fa-image upload-icon label-copy"></p>
              <br />
              <p className="label-copy">Upload Image</p>
            </div>
          </div>
        }
        <input className='caption-input' type="text" placeholder="Caption" value={caption} onChange={self.handleCaptionChange} />
        <a className="close-link" onClick={self.handleClose}>×</a>
      </div> )
  }
});

module.exports = imageUploader;