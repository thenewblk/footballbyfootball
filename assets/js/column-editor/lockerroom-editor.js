/**
 * @jsx React.DOM
 */

var React = require('react'),
    request = require('superagent'),
    moment = require('moment'),
    util = require('util');

var Column = require('./contentEditor.jsx'),
    Image = require('./imageUploader.jsx');

var Content = window.Content || {};

var Players = window.Players || {};

var LockerEntry = React.createClass({  
  getInitialState: function() {
    return { id: '', data: [], title: '', player: '', approved: false, submitted: false };
  },

  componentDidMount: function(){
    console.log('Locker Room Entry Editor Mounted');
  },

  componentWillMount: function(){

    if(this.props) {
      this.setState(this.props);
    }

  },

  handleChangeBig: function(){
    this.props.stuff(this.state);
  },

  // 
  // Image Content Events
  // 

  addImage: function(){
    var current_data = this.state.data;
    var tmp_content = {type: 'image', caption: '' };
    var new_data = current_data.concat(tmp_content);
    this.setState({data: new_data});
  },

  handleImage: function(image){
    var old_data = this.state.data;
    old_data[image.id].image_url = image.image_url;
    this.setState({data: old_data});
  },

  handleImageCaption: function(image){
    var old_data = this.state.data;
    old_data[image.id].caption = image.caption;
    this.setState({data: old_data});
  },

  handleImageType: function(image){
    var old_data = this.state.data;
    old_data[image.id].image_type = image.image_type;
    this.setState({data: old_data});
  },

  removeImage: function(content){
    var new_data = this.state.data;
    new_data.splice(content.id, 1);
    this.setState({data: new_data});
  },

  // 
  // Text Content Events
  // 

  addContent: function(){
    var current_data = this.state.data;
    var tmp_content = {type: 'content', content: '' };
    var new_data = current_data.concat(tmp_content);
    this.setState({data: new_data});
  },

  handleContent: function(content){
    var self = this;
    console.log(self.state);
    var old_data = self.state.data;
    old_data[content.id].content = content.content;
    self.setState({data: old_data});
  },

  removeContent: function(content){
    var new_data = this.state.data;
    console.log('removeContent: before new_data: '+ JSON.stringify(new_data));
    new_data.splice(content.id,1);
    this.setState({data: new_data});
    console.log('removeContent: after new_data: '+ JSON.stringify(new_data));
  },

  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  handlePlayer: function(event) {
    this.setState({player: event.target.value});
  },

  // 
  // Approved Check Box Events
  // 

  handleCheckbox: function() {
    var self = this;
    var cur_approved = self.state.approved;
    if (cur_approved == true) {
      self.setState({approved: false});
    } else {
      self.setState({approved: true});
    }
  },


  // 
  // Handle Delete Events
  // 

  handleDelete: function() {
    var self = this;
    request
      .del('/column/'+self.props.slug+'/delete')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        window.location = '/admin';
      }.bind(self));
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

  formatDate: function(stuff){
    console.log('stuff: ' + util.inspect(stuff));
  },

  submitContent: function(){
    var self = this;
    if (self.state.player) {
      self.setState({submitted: true});
      request
        .post(window.location.pathname)
        .send(self.state)
        .end(function(res) {
          console.log(res);
          if (res.text) {
            window.location = "/column/"+res.text;
          }
        }.bind(self));
    } else {
      alert('Enter a Player');
    }
  },

  render: function() {
    var self = this;
    var title = this.state.title;
    var today_date = moment().format("MMMM Do, YYYY");
    var main_image= this.state.main_image;

    var columns = this.state.data.map(function(object, i) {
      if ( object.type == 'content' ) {
        return <Column
          ref={'content-'+i}
          identifier={i}
          thing={object.content}
          content={self.handleContent}
          removed={self.removeContent} />;
      }
      if ( object.type == 'image' ) {
        return <Image 
          ref={'image-'+i} 
          identifier={i} 
          image={object} 
          caption_content={self.handleImageCaption} 
          type_content={self.handleImageType}  
          content={self.handleImage} 
          removed={self.removeImage} />;
      }
    });

    var player_options = Players.map(function(option) {
      return <option value={option._id}>{option.name}</option>
    });

    var checkbox_value = this.state.approved;

    var default_player = this.state.player._id;

    return (
      <div className="row" onChange={this.handleChangeBig}>
        <div className="lockerroom-entry">
          <div className="lockerrooom-entry-title">
            <select onChange={self.handlePlayer} value={default_player}>
              {player_options}
            </select>
          </div>
          <div className="column-content">
            {columns}
          </div>
          <div className="contentbar">
            <p className="content-link" onClick={this.addContent}>Add Text</p>
            <p className="content-link" onClick={this.addImage}>Add Image</p>
          </div>
          <div className="controlbar">
            <p className="control-link" onClick={this.handleDelete}><span className="fa fa-trash"></span>Delete</p>
            <p className="control-link"><input type="checkbox" checked={checkbox_value} onChange={this.handleCheckbox} /> Approved</p>
          </div>
          {this.state.submitted ? <a className='article-submit'><span className="fa fa-circle-o-notch fa-spin"></span></a> : <a className='article-submit' onClick={this.handleChangeBig}>test</a> }
        </div>
      </div>
    )
  }
});

var LockerList = React.createClass({ 
  getInitialState: function() {
    return { id: '', lockerentries: [], title: '', approved: false, submitted: false };
  },

  addEntry: function(){
    var current_data = this.state.lockerentries;
    var tmp_content = {};
    var new_data = current_data.concat(tmp_content);
    this.setState({lockerentries: new_data});
  },

  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  selfState: function(){
    var self = this;

    console.log('self.state: '+ util.inspect(self.state));

  },

  selfProps: function(){
    var self = this;

    console.log('self.props: '+ util.inspect(self.props));

  },

  selfFindChildren: function(){
    var self = this;

    console.log('self.props.children: '+ util.inspect(self.props.children));

  },

  selfPropsChildren: function(){
    var self = this;

    console.log('self._renderedComponent.props.children: '+ util.inspect( self._renderedComponent.props.children ));

  },

  getSelf: function(){
    var self = this;

    console.log('self: '+ util.inspect(self));

  },



  handleStuff: function(content) {
    console.log('handleStuff: '+util.inspect(content));
    var old_lockerentries = this.state.lockerentries;
    old_lockerentries[content.id] = content;
    console.log('old_lockerentries: '+ JSON.stringify(old_lockerentries));
    this.setState({lockerentries: old_lockerentries});
  },

  handleContentChange: function(content) {
    console.log('handleContentChange: '+util.inspect(content));
    var old_lockerentries = this.state.lockerentries;
    old_lockerentries[content.id] = content;
    console.log('old_lockerentries: '+ JSON.stringify(old_lockerentries));
    this.setState({lockerentries: old_lockerentries}); 
  },

  render: function() {
    var self = this;
    var title = self.state.title;
    var lockers = this.state.lockerentries.map(function(object, i) {
      return <LockerEntry title="Hello" id={i} stuff={self.handleStuff} content_change={this.handleContentChange} />;
    });
    var divStyle = {
      backgroundImage: 'url(https://s3.amazonaws.com/footballbyfootball-dev/lockerroom/sansjags_backer.jpg)'
    };
    return (
      <div className="lockerroom editor">
        <div className="lockerroom-header" style={divStyle}>
          <div className="container">
            <h1 className="title"><input className='column-title-tag' type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" /></h1>
          </div>
        </div>

        <div className="lockerroom-content">
          <div className="container">
            <div className="col-md-8">
              {lockers}
              <div className="contentbar">
                <p className="content-link" onClick={this.addEntry}>Add Locker Entry</p>
              </div>
              <div className="contentbar">
                <p className="content-link" onClick={this.getSelf}>self</p>
                <p className="content-link" onClick={this.selfState}>self.state</p>
                <p className="content-link" onClick={this.selfProps}>self.props</p>
                <p className="content-link" onClick={this.selfPropsChildren}>self.props.children</p>
              </div>

              {this.state.submitted ? <a className='article-submit'><span className="fa fa-circle-o-notch fa-spin"></span></a> : <a className='article-submit' onClick={this.testContent}>test</a> }
            </div>
          </div>
        </div>
      </div>
    )
  }
});


React.renderComponent(
  LockerList(),
  document.getElementById('react-content')
)