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
    return {active: false };
  },

  componentWillMount: function() {
  },

  handleChange: function(event) {

  },

  handleCaptionChange: function(event) {
    this.props.caption_content({id: this.props.identifier, caption: event.target.value });
  },

  handleClose: function() {
    this.props.removed({id: this.props.identifier});
  },

  getScriptURL: function() {
    return '/js/dropzone.js';
  },

  onScriptLoaded: function() {
    var self = this;
    myDropzone[self.props.identifier] = new Dropzone(".uploader-"+self.props.identifier, { url: "/upload", paramName: "file", maxFiles: 1});

    myDropzone[self.props.identifier].on("success", function(file) {
      /* Maybe display some more file information on your page */
      var thing = JSON.parse(file.xhr.response);
      console.log('success: ' + thing.saved);
      self.props.content({id: self.props.identifier, image_url: thing.saved  });
      self.setState({ active: true });
    });
  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  theValue: function (){
  },

  render: function() {
    var caption = this.props.caption;
    var className = this.state.active ? 'content-container active' : 'content-container';
    return ( 
      <div className={className} ref='contentwrapper'>

        <h2>Image</h2>
        {this.props.image ?  
          <div className='uploaded-image'>
            <img src={"https://s3.amazonaws.com/footballbyfootball-dev"+this.props.image} />
          </div> 
        : 
          <div className='image-container'>
            <div className={"image-uploader uploader-"+this.props.identifier}>
              <p><span className="fa fa-image"></span></p>Upload Images
            </div>
          </div>
        }
        <input className='column-title-tag' type="text" placeholder="Caption" value={caption} onChange={this.handleCaptionChange} />
        <a className="close-link" onClick={this.handleClose}>×</a>
      </div> )
  }
});

module.exports = imageUploader;