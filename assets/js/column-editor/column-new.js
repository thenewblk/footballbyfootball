/**
 * @jsx React.DOM
 */

var React = require('react');
var request = require('superagent');
var moment = require('moment');


var Column = require('./contentEditor.jsx');

var Image = require('./imageUploader.jsx');

var Content = window.Content || {};

var Players = window.Players || {};

var ColumnList = React.createClass({  
  getInitialState: function() {
    return { data: [], title: '', mainImage: {}, player: '', approved: false };
  },

  componentDidMount: function(){
  },

  componentWillMount: function(){
  },

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

  removeImage: function(content){
    var new_data = this.state.data;
    new_data.splice(content.id,1);
    this.setState({data: new_data});
  },

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

  handleMainImage: function(image){
    var main_image = this.state.mainImage;
    main_image.image_url = image.image_url;
    this.setState({mainImage: main_image });
  },

  handleMainImageCaption: function(image){
    var main_image = this.state.mainImage;
    main_image.caption = image.caption;
    this.setState({mainImage: main_image });
  },

  removeMainImage: function(content){
    this.setState({mainImage: {image_url: ''} });
    console.log('main image: '+JSON.stringify(this.state.mainImage));
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

  testContent: function(){
    var self = this;
    console.log( 'title: '+ self.state.title );
    console.log( 'mainImage: '+ JSON.stringify(self.state.mainImage) );
    console.log('children: '+ self.state.data.length);
    for (var i = 0; i < self.state.data.length; i++) {
      console.log( 'content #: '+ i );
      if ( self.state.data[i].type == 'content' ) {
        console.log( ' data.content: '+ self.state.data[i].content );
      } else if ( self.state.data[i].type == 'image' ) {
        console.log( ' data.image_url: '+ self.state.data[i].image_url );
        console.log( ' data.caption: '+ self.state.data[i].caption );
      }
    }
  },

  submitContent: function(){
    var self = this;

    request
      .post('/column/new')
      .send({ title: self.state.title, data: self.state.data, main_image: self.state.mainImage, player: self.state.player, approved: self.state.approved  })
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
    var main_image= this.state.mainImage;

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
              <Image 
                identifier='main'
                image={main_image.image_url}
                caption_content={self.handleMainImageCaption} 
                content={self.handleMainImage} 
                removed={self.removeMainImage} />
            </div>
            <div className="column-content">
              {columns}
            </div>
            <div className="contentbar">
              <p className="content-link" onClick={this.addContent}>Add Text</p>
              <p className="content-link" onClick={this.addImage}>Add Image</p>
            </div>
            <a className='article-submit' onClick={this.submitContent}>submit</a>
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