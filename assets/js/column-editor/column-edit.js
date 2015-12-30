
/**
 * @jsx React.DOM
 */

var React = require('react'),
    request = require('superagent'),
    moment = require('moment'),
    util = require('util');

var Column = require('./trumboEditor.jsx'),
    Image = require('./imageUploader.jsx'),
    Embed = require('./embedEditor.jsx');

var Content = window.slug || {};

var Players = window.Players || {};

var Types =  ['locks', 'fantasy', 'wwkjd', 'column', 'breakdown'];

var uniqueId;

uniqId = function(thing) {
  return thing.replace(/[^A-Za-z0-9\s!?]/g,'').replace(/ /g,'').substr(0, 15);
};


var ColumnList = React.createClass({
  getInitialState: function() {
    return { id: '', data: [], title: '', main_image: {active: true}, player: Players[0]._id, approved: false, submitted: false, type: 'column' };
  },

  componentDidMount: function(){
    console.log('Column Editor Mounted');
  },

  componentWillMount: function(){

    // if(Content) {
    //   this.setState({slug: Content});
    // }

    var self = this;
    request
      .get('/api/column/'+Content)
      .end(function(res) {
        self.setState(JSON.parse(res.text));
      }.bind(self));


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
  // Embed Events
  //

  addEmbed: function(){
    var current_data = this.state.data;
    var tmp_content = {type: 'embed', content: '',  };
    var new_data = current_data.concat(tmp_content);
    this.setState({data: new_data});
  },

  handleEmbed: function(content){
    var old_data = this.state.data;
    old_data[content.id].content = content.content;
    this.setState({data: old_data});
  },

  removeContent: function(content){
    var new_data = this.state.data;
    console.log('removeEmbed: before new_data: '+ JSON.stringify(new_data));
    new_data.splice(content.id,1);
    this.setState({data: new_data});
    console.log('removeContent: after new_data: '+ JSON.stringify(new_data));
  },

  //
  // Text Content Events
  //

  addContent: function(){
    var current_data = this.state.data;
    var tmp_content = {type: 'content', content: '',  };
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

  handleSubTitleChange: function(event) {
    this.setState({subtitle: event.target.value});
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
      .del('/column/'+self.state.slug+'/delete')
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
  // Handle Swaps
  //

  swapPreviousThing: function(content){

    var new_data = this.state.data;

    if (content.id > 0) {
      var temp_thing_1 = new_data[ content.id ];
      var temp_thing_2 = new_data[ content.id - 1 ];
      new_data.splice( content.id - 1, 2, temp_thing_1, temp_thing_2);
      this.setState({data: new_data});
    } else {
      alert("You've reached the top.");
    }

  },

  swapNextThing: function(content){

    var new_data = this.state.data;

    if (content.id < ( new_data.length - 1 )) {
      var temp_thing_1 = new_data[ content.id ];
      var temp_thing_2 = new_data[ content.id + 1 ];
      new_data.splice( content.id, 2, temp_thing_2, temp_thing_1);
      this.setState({data: new_data});
    } else {
      alert("You've reached the end.");
    }
  },

  // unMoved: function(content){
  //   var new_data = this.state.data;

  //   for( i =0; i < new_data.length; i++ ) {
  //     if ( new_data[i].id == content.id) {
  //       new_data[ i ].thing_moved = false;
  //     }
  //   }


  //   this.setState({data: new_data});
  // },


  //
  // Submit Form
  //

  formatDate: function(stuff){
    console.log('stuff: ' + util.inspect(stuff));
  },

  submitContent: function(){
    var self = this;

    for (i=0; i< self.state.data.length; i++){
      delete self.state.data[i].id;
      delete self.state.data[i].thing_moved;
    }


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
    var subtitle = this.state.subtitle;
    var today_date = moment().format("MMMM Do, YYYY");
    var main_image= this.state.main_image;

    var columns = this.state.data.map(function(object, i) {
      if ( object.type == 'content' ) {
        if(object.id){

        } else {
          object.id = Math.floor(Math.random() * (999999 - 100000) + 100000);
        }
        var moved = object.thing_moved;

        return <Column
          ref={'content-'+i}
          identifier={i}
          thing_id={object.id}
          thing={object.content}
          content={self.handleContent}
          removed={self.removeContent}
          thing_moved={moved}

          key={object.id}

          thing_un_moved={self.unMoved}

          swap_previous={self.swapPreviousThing}
          swap_next={self.swapNextThing} />;
      }
      if ( object.type == 'embed' ) {
        if(object.id){

        } else {
          object.id = Math.floor(Math.random() * (999999 - 100000) + 100000);
        }
        var moved = object.thing_moved;

        return <Embed
          ref={'embed-'+i}
          identifier={i}
          key={object.id}
          thing={object.content}
          thing_id={object.id}
          content={self.handleContent}
          removed={self.removeContent}

          swap_previous={self.swapPreviousThing}
          swap_next={self.swapNextThing} />;
      }
      if ( object.type == 'image' ) {
        return <Image
          ref={'image-'+i}
          identifier={i}
          image={object}
          caption_content={self.handleImageCaption}
          type_content={self.handleImageType}
          content={self.handleImage}
          removed={self.removeImage}
          swap_previous={self.swapPreviousThing}
          swap_next={self.swapNextThing} />;
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
              <h2 className="title"><input key={'title'} className='column-title-tag' type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" /></h2>
              <p className="date">{ today_date }</p>
              { this.state.main_image.image_url || this.state.main_image.active ?
                <Image
                identifier='main'
                image={main_image}
                key={'main_image'}
                caption_content={self.handleMainImageCaption}
                content={self.handleMainImage}
                removed={self.removeMainImage} />
                : <p className="add-main-image" onClick={this.addMainImage}><span className="fa fa-plus"></span> Add Main Image</p>
              }
              <h3 className="subtitle"><input key={'subtitle'} className='column-title-tag' type="text" value={subtitle} onChange={this.handleSubTitleChange} placeholder="Sub Title" /></h3>
            </div>

            <div className="column-content">
              {columns}
            </div>
            <div className="contentbar">
              <p className="content-link" onClick={this.addContent}>Add Text</p>
              <p className="content-link" onClick={this.addImage}>Add Image</p>
              <p className="content-link" onClick={this.addEmbed}>Add Embed</p>
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
  ColumnList(),
  document.getElementById('react-content')
)
