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
    return { id: '', data: [], player: '', approved: false, submitted: false, key: '' };
  },

  componentDidMount: function(){
    console.log('Locker Room Entry Editor Mounted');
  },

  componentWillMount: function(){
  
    if(this.props) {
      this.setState(this.props);
    }
    if(this.props.key) {
      this.setState({key: this.props.key});
    }
    if (this.props.data){
      this.setState({data: this.props.data});
    }
    if (this.props.player){
      this.setState({player: this.props.player});
    }
  },
  // componentDidMount: function(){
  //   this.props.stuff(this.state);
  // },

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
    this.props.removed({id: this.state.id});
  }, 

  // 
  // Test Content
  // 

  testContent: function(){
    var self = this;
    console.log('lockerentry: '+util.inspect(this.state));
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
    return { id: '', lockerentries: [], title: '', approved: false, submitted: false, type: 'lockerroom' };
  },

  componentWillMount: function(){
    if(this.props) {
      this.setState(this.props);
    }
  },

  addEntry: function(){
    var current_data = this.state.lockerentries;
    var tmp_content = {data: [], player: Players[0], key: Math.random()};
    var new_data = current_data.concat(tmp_content);
    this.setState({lockerentries: new_data});
  },

  removeEntry: function(content){
    var new_lockerentries = this.state.lockerentries;
    console.log
    new_lockerentries.splice(content.id,1);
    this.setState({lockerentries: new_lockerentries});
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
    for (var i=0; i<old_lockerentries.length;i++){
      if ((old_lockerentries[i].key || old_lockerentries[i]._id)  == (content.key || content._id)) {
        old_lockerentries[i] = content;
      }
    }
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

    var lockers = self.state.lockerentries.map(function(object, i) {

      var key = object._id || object.key || Math.random();

      return <LockerEntry
                ref={'lockerentry-'+i} 
                key={key}
                id={i} 
                player={object.player._id}
                data={object.data}
                stuff={self.handleStuff}
                removed={self.removeEntry}  />;
    });
    var divStyle = {
      backgroundImage: 'url(https://s3.amazonaws.com/footballbyfootball-dev/lockerroom/sansjags_backer.jpg)'
    };
    var checkbox_value = self.state.approved;
    return (
      <div className="lockerroom editor">
        <div className="lockerroom-header" style={divStyle}>
          <div className="title">
            <div className="container">
              <h1 className="title"><input className='column-title-tag' type="text" value={title} onChange={self.handleTitleChange} placeholder="Title" /></h1>
            </div>
          </div>
        </div>

        <div className="lockerroom-content">
          <div className="container">
            <div className="col-md-8">
              {lockers}
              <div className="contentbar">
                <p className="content-link" onClick={self.addEntry}>Add Locker Entry</p>
              </div>
              {self.state.submitted ? <a className='article-submit'><span className="fa fa-circle-o-notch fa-spin"></span></a> : <a className='article-submit' onClick={self.submitContent}>Submit</a> }
            </div>
            <div className="col-md-4">
              <div className="lockerroom-sidebar">
                <h2 className="lr-sidebar-title">Controls</h2>
                <p className="lr-sidebar-link" onClick={self.removeLockerroom}><span className="fa fa-trash"></span> Delete</p>
                <p className="lr-sidebar-link"><input type="checkbox" checked={checkbox_value} onChange={self.handleCheckbox} /> Approved</p>
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