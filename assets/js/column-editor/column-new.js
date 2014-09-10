/**
 * @jsx React.DOM
 */

var React = require('react');
var request = require('superagent');
var moment = require('moment');
var util = require('util');


var Column = require('./contentEditor.jsx');

var Image = require('./imageUploader.jsx');

var Content = window.Content || {};

var Players = window.Players || {};

var ColumnList = React.createClass({  
  getInitialState: function() {
    return { data: [], title: '', main_image: {active: true}, player: '', approved: false };
  },

  componentDidMount: function(){
  },

  componentWillMount: function(){
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
    new_data.splice(content.id,1);
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
    var old_data = this.state.data;
    old_data[content.id].content = content.content;
    this.setState({data: old_data});
  },

  removeContent: function(content){
    var new_data = this.state.data;
    new_data.splice(content.id,1);
    this.setState({data: new_data});
  },

  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  handlePlayer: function(event) {
    this.setState({player: event.target.value});
  },

  // 
  // Main Image Events
  // 

  handleMainImage: function(image){
    var main_image = this.state.main_image;
    main_image.image_url = image.image_url;
    this.setState({mainImage: main_image });
  },

  handleMainImageCaption: function(image){
    var main_image = this.state.main_image;
    main_image.caption = image.caption;
    this.setState({mainImage: main_image });
  },

  removeMainImage: function(content){
    var tmp = {image_url: '', caption: '', active: false}
    this.setState({mainImage: tmp });
    console.log('main image: '+JSON.stringify(this.state.main_image));
  },

  addMainImage: function(content){
    this.setState({mainImage: {active: true} });
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
    // .send({ title: self.state.title, data: self.state.data, main_image: self.state.main_image, player: self.state.player, approved: self.state.approved  })
    request
      .post(window.location.pathname)
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          window.location = "/column/"+res.text;
        }
      }.bind(self));
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
          image={object.image_url} 
          caption_content={self.handleImageCaption} 
          type_content={self.handleImageType}  
          content={self.handleImage} 
          removed={self.removeImage} />;
      }
    });

    var player_options = Players.map(function(option) {
      return <option value={option._id} >{option.name}</option>
    });

    var checkbox_value = this.state.approved;

    return (
      <div className="container">
        <div className="row"> 
          <div className="col-md-8">
            <div className="column-header">
              <h2 className="title"><input className='column-title-tag' type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" /></h2>
              <p className="date">{ today_date }</p>
              <p className="approved-check"><input type="checkbox" checked={checkbox_value} onChange={this.handleCheckbox} /> Approved</p>
              { this.state.main_image.active ? 
                <Image 
                identifier='main'
                image={main_image.image_url}
                caption_content={self.handleMainImageCaption} 
                content={self.handleMainImage} 
                removed={self.removeMainImage} />
                : <p onClick={this.addMainImage}><span className="fa fa-plus"></span> Add Main Image</p> 
              }
            </div>
            <div className="column-content">
              {columns}
            </div>
            <div className="contentbar">
              <p className="content-link" onClick={this.addContent}>Add Text</p>
              <p className="content-link" onClick={this.addImage}>Add Image</p>
            </div>
            <a className='article-submit' onClick={this.testContent}>test</a>
          </div>
          <div className="col-md-4">
            <div className="author-badge">
              <div className="black banner right">Select Author</div>
              <div className="content">
                <select onChange={self.handlePlayer}>
                  <option value="">Select a Player</option>
                  {player_options}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
});

React.renderComponent(
  ColumnList(Content),
  document.getElementById('react-content')
)