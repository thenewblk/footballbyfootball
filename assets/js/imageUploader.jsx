/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('./ReactScriptLoader.js');
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

  componentDidUpdate: function() {
    var self = this;
    console.log('componentDidUpdate: '+ self.props.image);
    if (self.props.image > 0){
      self.setState({ active: true });
    }    
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('componentWillReceiveProps');

    console.log(' nextProps: '+JSON.stringify(nextProps));

    console.log(' nextProps.image: '+nextProps.image)


    if (nextProps.image){
      this.setState({ active: true });
    }
  },

  handleChange: function(event) {

  },

  handleClose: function() {
    this.props.removed({id: this.props.identifier});
  },

  getScriptURL: function() {
    return '/js/dropzone.js';
  },

  onScriptLoaded: function() {
    var self = this;
    myDropzone[self.props.identifier] = new Dropzone(".uploader-"+self.props.identifier, { url: "/upload", paramName: "file"});

    myDropzone[self.props.identifier].on("success", function(file) {
      /* Maybe display some more file information on your page */
      var thing = JSON.parse(file.xhr.response);
      console.log('success: ' + thing.saved);
      self.props.content({id: self.props.identifier, image_url: thing.saved });
    });
  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  theValue: function (){
  },

  render: function() {
    var className = this.state.active ? 'content-container active' : 'content-container';
    return ( 
      <div className={className} ref='contentwrapper'>

        <h2>Image</h2>
        {this.state.active ?  
          <div className='uploaded-image'>
            <img src={"https://s3.amazonaws.com/footballbyfootball-dev"+this.props.image} />
          </div> 
        : 
          <div className={"image-uploader uploader-"+this.props.identifier}>
            Upload Images
          </div>
        }
        <a className="close-link" onClick={this.handleClose}>×</a>
      </div> )
  }
});

module.exports = imageUploader;