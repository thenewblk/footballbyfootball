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

var Types =  ['locks', 'fantasy', 'wwkjd', 'column', 'breakdown'];

var ColumnList = React.createClass({  
  getInitialState: function() {
    return { id: '', data: [], title: '', main_image: {active: true}, player: Players[0]._id, approved: false, submitted: false, type: 'column' };
  },

  componentDidMount: function(){
    console.log('Column Editor Mounted');
  },

  componentWillMount: function(){

    if(this.props) {
      this.setState(this.props);
    }

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
    console.log('old_data: '+ JSON.stringify(old_data));
    this.setState({data: old_data});
  },

  handleImageCaption: function(image){
    var old_data = this.state.data;
    old_data[image.id].caption = image.caption;
    console.log('old_data: '+ JSON.stringify(old_data));
    this.setState({data: old_data});
  },

  handleImageType: function(image){
    var old_data = this.state.data;
    old_data[image.id].image_type = image.image_type;
    this.setState({data: old_data});
  },

  removeImage: function(content){
    var new_data = this.state.data;
    console.log('removeImage: before new_data: '+ JSON.stringify(new_data));
    new_data.splice(content.id,1);
    this.setState({data: new_data});
    console.log('removeImage: after new_data: '+ JSON.stringify(new_data));
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

  handleType: function(event) {
    this.setState({type: event.target.value});
  },

  // 
  // Main Image Events
  // 

  handleMainImage: function(image){
    var main_image = this.state.main_image;
    main_image.image_url = image.image_url;
    this.setState({main_image: main_image });
  },

  handleMainImageCaption: function(image){
    var main_image = this.state.main_image;
    main_image.caption = image.caption;
    this.setState({main_image: main_image });
  },

  removeMainImage: function(content){
    var tmp = {active: false, image_url: ''}
    this.setState({main_image: tmp });
    console.log('main image: '+JSON.stringify(this.state.main_image));
  },

  addMainImage: function(content){
    this.setState({main_image: {active: true} });
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
    if (self.state.title.length > 0){
      self.setState({submitted: true});
      request
        .post(window.location.pathname)
        .send(self.state)
        .end(function(res) {
          console.log(res)
          if (res.text) {
            window.location = "/column/"+res.text;
          }
        }.bind(self));
    } else {
      alert("Please enter a title.");
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

    var type_options = Types.map(function(option) {
      return <option value={option} >{option}</option>
    });

    var checkbox_value = this.state.approved;

    var default_player = this.state.player._id;

    var default_type = this.state.type;

    return (
      <div className="container">
        <div className="row"> 
          <div className="col-md-8">
            <div className="column-header">
              <h2 className="title"><input className='column-title-tag' type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" /></h2>
              <p className="date">{ today_date }</p>
              { this.state.main_image.image_url || this.state.main_image.active ? 
                <Image 
                identifier='main'
                image={main_image}
                caption_content={self.handleMainImageCaption}
                content={self.handleMainImage} 
                removed={self.removeMainImage} />
                : <p className="add-main-image" onClick={this.addMainImage}><span className="fa fa-plus"></span> Add Main Image</p> 
              }
            </div>
            <div className="column-content">
              {columns}
            </div>
            <div className="contentbar">
              <p className="content-link" onClick={this.addContent}>Add Text</p>
              <p className="content-link" onClick={this.addImage}>Add Image</p>
            </div>
            {this.state.submitted ? <a className='article-submit'><span className="fa fa-circle-o-notch fa-spin"></span></a> : <a className='article-submit' onClick={this.submitContent}>submit</a> }
          </div>
          <div className="col-md-4">
            <div className="lockerroom-sidebar">
              <h2 className="lr-sidebar-title">Controls</h2>
              <div className="lr-sidebar-link">
                <p className="select-label">Author:</p>
                <select onChange={self.handlePlayer} value={default_player}>
                  {player_options}
                </select>
              </div>
              <div className="lr-sidebar-link">
                <p className="select-label">Column Type:</p>
                <select onChange={self.handleType} value={default_type}>
                  {type_options}
                </select>
              </div>
              <p className="lr-sidebar-link" onClick={this.handleDelete}><span className="fa fa-trash"></span>Delete</p>
              <p className="lr-sidebar-link"><input type="checkbox" checked={checkbox_value} onChange={this.handleCheckbox} /> Approved</p>
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