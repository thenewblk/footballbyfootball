/**
 * @jsx React.DOM
 */

var React = require('react'),
    request = require('superagent'),
    moment = require('moment'),
    util = require('util');

var Column = require('./contentEditor.jsx'),
    Image = require('./imageUploader.jsx');

var Locker = window.Locker || {};

var Players = window.Players || {};

var LockerEntry = React.createClass({  
  getInitialState: function() {
    return { id: '', data: [], player: '', approved: false, submitted: false };
  },

  componentDidMount: function(){
    console.log('Locker Room Entry Editor Mounted');
  },

  componentWillMount: function(){
    
    if(this.props) {
      this.setState(this.props);
    }
    if (this.props.data){
      this.setState({data: this.props.data});
    }
    if (this.props.player){
      this.setState({player: this.props.player});
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
    this.setState({data: new_data}, function(){
      this.props.stuff(this.state);
    });
  },

  handleImage: function(image){
    var old_data = this.state.data;
    old_data[image.id].image_url = image.image_url;
    this.setState({data: old_data}, function(){
      this.props.stuff(this.state);
    });
  },

  handleImageCaption: function(image){
    var old_data = this.state.data;
    old_data[image.id].caption = image.caption;
    this.setState({data: old_data}, function(){
      this.props.stuff(this.state);
    });
  },

  handleImageType: function(image){
    var old_data = this.state.data;
    old_data[image.id].image_type = image.image_type;
    this.setState({data: old_data}, function(){
      this.props.stuff(this.state);
    });
  },

  removeImage: function(content){
    var new_data = this.state.data;
    new_data.splice(content.id, 1);
    this.setState({data: new_data}, function(){
      this.props.stuff(this.state);
    });
  },

  // 
  // Text Content Events
  // 

  addContent: function(){
    var current_data = this.state.data;
    var tmp_content = {type: 'content', content: '' };
    var new_data = current_data.concat(tmp_content);
    this.setState({data: new_data}, function(){
      this.props.stuff(this.state);
    });
  },

  handleContent: function(content){
    var self = this;
    var old_data = self.state.data;

    console.log('handleContent:');
    console.log(' sent content:'+util.inspect(content));
    console.log(' sent id:'+content.id);
    console.log(' old_data[]:'+util.inspect(old_data[content.id]));

    old_data[content.id].content = content.content;
    self.setState({data: old_data}, function(){
      this.props.stuff(this.state);
    });
  },

  removeContent: function(content){
    var new_data = this.state.data;
    new_data.splice(content.id,1);
    this.setState({data: new_data}, function(){
      this.props.stuff(this.state);
    });
  },


  handlePlayer: function(value) {
    var self = this;
    var target_value = value;
    self.setState({player: value.target.value}, function(){
      this.props.stuff(this.state);
    });
    
  },

  // 
  // Approved Check Box Events
  // 

  handleCheckbox: function() {
    var self = this;
    var cur_approved = self.state.approved;
    if (cur_approved == true) {
      self.setState({approved: false}, function(){
        this.props.stuff(this.state);
      });
    } else {
      self.setState({approved: true}, function(){
        this.props.stuff(this.state);
      });
    }
  },


  // 
  // Handle Delete Events
  // 

  handleDelete: function() {
    console.log('handleDelete #'+this.props.id);
    this.props.removed ({id: this.props.id});
  }, 

  // 
  // Test Content
  // 

  testContent: function(){
    var self = this;
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
          entry={self.props.id}
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

    var default_player = this.state.player;

    return (
      <div className="row">
        <div className="lockerroom-entry">
          <div className="lockerrooom-entry-title">
            <select onChange={self.handlePlayer} value={default_player}>
              {player_options}
            </select>
            <p className="lockerroom-entry-delete" onClick={this.handleDelete}><span className="fa fa-trash"></span>Delete</p>
          </div>
          <div className="column-content">
            {columns}
          </div>
          <div className="contentbar">
            <p className="content-link" onClick={this.addContent}>Add Text</p>
            <p className="content-link" onClick={this.addImage}>Add Image</p>
          </div>
        </div>
      </div>
    )
  }
});

var LockerList = React.createClass({ 
  getInitialState: function() {
    return { id: '', lockerentries: [], title: '', approved: false, submitted: false };
  },

  componentWillMount: function(){

    if(this.props) {
      this.setState(this.props);
    }

  },

  addEntry: function(){
    var current_data = this.state.lockerentries;
    console.log('Players[0]._id: ' + Players[0]._id);
    var tmp_content = {data: [], player: Players[0]};
    var new_data = current_data.concat(tmp_content);
    this.setState({lockerentries: new_data});
  },

  removeEntry: function(content){
    console.log('removeEntry: '+util.inspect(content));
    var new_data = this.state.lockerentries;
    new_data.splice(content.id,1);
    this.setState({lockerentries: new_data});
  },

  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  handleCheckbox: function() {
    var self = this;
    var cur_approved = self.state.approved;
    if (cur_approved == true) {
      self.setState({approved: false});
    } else {
      self.setState({approved: true});
    }
  },

  removeLockerroom: function(){
    var self = this;
    request
      .del("/lockerroom/"+self.props.slug+'/delete')
      .send(self.state)
      .end(function(res) {
        window.location = "/admin";
      }.bind(self));
  },

  handleStuff: function(content) {
    var old_lockerentries = this.state.lockerentries;
    old_lockerentries[content.id] = content;
    this.setState({lockerentries: old_lockerentries});
  },

  // 
  // Test Content
  // 

  testContent: function(){
    var self = this;
    console.log('self: '+util.inspect(this.state));
  },

  submitContent: function(){
    var self = this;
    self.setState({submitted: true});
    request
      .post(window.location.pathname)
      .send(self.state)
      .end(function(res) {
        if (res.text) {
          window.location = "/lockerroom/"+res.text;
        }
      }.bind(self));
  },

  render: function() {
    var self = this;
    var title = self.state.title;
    var lockers = this.state.lockerentries.map(function(object, i) {
      console.log('object.player: ' + util.inspect(object.player));
      var player_id = object.player._id;
      return <LockerEntry 
                id={i} 
                data={object.data}
                player={player_id}
                stuff={self.handleStuff}
                removed={self.removeEntry}  />;
    });
    var divStyle = {
      backgroundImage: 'url(https://s3.amazonaws.com/footballbyfootball-dev/lockerroom/sansjags_backer.jpg)'
    };
    var checkbox_value = this.state.approved;
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

              {this.state.submitted ? <a className='article-submit'><span className="fa fa-circle-o-notch fa-spin"></span></a> : <a className='article-submit' onClick={this.submitContent}>Submit</a> }
            </div>
            <div className="col-md-4">
              <div className="lockerroom-sidebar">
                <h2 className="lr-sidebar-title">Controls</h2>
                <p className="lr-sidebar-link" onClick={this.removeLockerroom}><span className="fa fa-trash"></span> Delete</p>
                <p className="lr-sidebar-link"><input type="checkbox" checked={checkbox_value} onChange={this.handleCheckbox} /> Approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


React.renderComponent(
  LockerList(Locker),
  document.getElementById('react-content')
)