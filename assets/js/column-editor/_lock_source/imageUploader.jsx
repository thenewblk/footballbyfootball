/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('../ReactScriptLoader.js');
var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var util = require('util');

var myDropzone = [];

var Types =  ['full-width', 'left-aligned', 'right-aligned', 'left-logo'];

var imageUploader = React.createClass({
  

  mixins: [ReactScriptLoaderMixin],

  getInitialState: function() {
    return {active: false, image_removed: false };
  },

  handleCaptionChange: function(event) {
    this.props.caption_content({id: this.props.identifier, caption: event.target.value });
  },

  handleTypeChange: function(event) {
    this.props.type_content({id: this.props.identifier, image_type: event.target.value });
  },

  handleClose: function() {
    
    var self = this;
    self.props.removed({id: self.props.identifier});
    self.setState({active: false});

  },

  handleSwapPrevious: function() {
    this.props.swap_previous({id: this.props.identifier});
  },

  handleSwapNext: function() {
    this.props.swap_next({id: this.props.identifier});
  },

  getScriptURL: function() {
    return '/js/dropzone.js';
  },

  onScriptLoaded: function() {
    var self = this;
    var image = this.props.image.image_url;
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


    var className = image || active ? 'content-container active' : 'content-container';

    var type_options = Types.map(function(option) {
      return <option value={option} >{option}</option>
    });

    return ( 
      <div className={className} ref='contentwrapper'>
        <div className="position-control">
          <span className="move up" onClick={this.handleSwapPrevious}></span>
          <span className="move down" onClick={this.handleSwapNext}></span>
        </div>
        {image.image_url ?  
          <div className='uploaded-image'>
            <img src={"https://s3.amazonaws.com/footballbyfootball-dev"+image.image_url} />
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
        {self.props.identifier != 'main' ? 
        <select onChange={self.handleTypeChange} value={image.image_type}> 
          <option value="">Image Type</option>
          {type_options}
        </select> 
        : ''}
        <a className="close-link" onClick={self.handleClose}>×</a>
      </div> )
  }
});

module.exports = imageUploader;