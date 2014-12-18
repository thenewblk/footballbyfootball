/**
 * @jsx React.DOM
 */

var React = require('react'),
    request = require('superagent'),
    util = require('util');

var Column = require('./contentEditor.jsx'),
    Image = require('./imageUploader.jsx');

var Content = window.Content || {};

var dz = require('../dropzone.js');

var ColumnList = React.createClass({  
  getInitialState: function() {
    return { image_url: '', name: '', description: '' };
  },

  componentDidMount: function(){
    console.log('Player Editor Mounted');
  },

  componentWillMount: function(){

    if(this.props) {
      this.setState(this.props);
    }

    console.log(util.inspect(this.state));

  },

  // 
  // Image Content Events
  // 

  handleImage: function(image){
    this.setState({image_url: image.image_url});
  },

  removeImage: function(content){
    if( content.id ){
      this.setState({image_url: ''});
    }
    
  },



  // 
  // Text Content Events
  // 


  handleDescription: function(content){
    this.setState({description: content.content});
  },

  handleNameChange: function(event) {
    this.setState({name: event.target.value});
  },

  // 
  // Test Content
  // 

  testContent: function(){
    var self = this;

    console.log('self: '+ util.inspect(self.state));
    console.log('window.location.pathname'+window.location.pathname);
  },


  // 
  // Submit Form
  // 


  submitContent: function(){
    var self = this;

    self.setState({submitted: true});
    console.log(util.inspect(self.state));
    request
      .post(window.location.pathname)
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          window.location = "/player/"+res.text;
        }
      }.bind(self));

  },

  render: function() {
    var self = this;
    var name = self.state.name;
    var description = self.state.description;
    var image_url= self.state.image_url;

    return (
      <div className="col-md-8 col-md-offset-2">
              <h2>Edit Player</h2>
              <h3 className="subtitle"><input key={'subtitle'} className='column-title-tag' type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
              <Image 
                identifier='main'
                image_url={image_url}
                removed={self.removeImage}
                content={self.handleImage}  />
              <Column
                ref={'player-editor'}
                thing={description}
                content={self.handleDescription}
                 />
            {this.state.submitted ? <a className='article-submit'><span className="fa fa-circle-o-notch fa-spin"></span></a> : <a className='article-submit' onClick={this.submitContent}>submit</a> }
            <a className='article-submit' onClick={this.testContent}>test</a>
      </div>
      
    )
  }
});



React.renderComponent(
  ColumnList(Content),
  document.getElementById('react-content')
)