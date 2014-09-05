/**
 * @jsx React.DOM
 */

var React = require('react');

var Column = require('./contentEditor.jsx');

var Image = require('./imageUploader.jsx');

var ColumnList = React.createClass({  
  getInitialState: function() {
    return { data: [], title: '' };
  },

  componentDidMount: function(){
    console.log('mounted');
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
    console.log('old_data: '+ JSON.stringify(old_data));
    this.setState({data: old_data});
  },

  handleImageCaption: function(image){
    var old_data = this.state.data;
    old_data[image.id].caption = image.caption;
    console.log('old_data: '+ JSON.stringify(old_data));
    this.setState({data: old_data});
  },

  removeImage: function(content){
    var new_data = this.state.data;
    console.log('removeImage: before new_data: '+ JSON.stringify(new_data));
    new_data.splice(content.id,1);
    this.setState({data: new_data});
    console.log('removeImage: after new_data: '+ JSON.stringify(new_data));
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
    console.log('removeContent: before new_data: '+ JSON.stringify(new_data));
    new_data.splice(content.id,1);
    this.setState({data: new_data});
    console.log('removeContent: after new_data: '+ JSON.stringify(new_data));
  },

  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  submitContent: function(){
    var self = this;
    console.log( 'title: '+ self.state.title );
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
  render: function() {
    var self = this;
    var title = this.state.title;
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
    return (
      <div className="container">
        <div className='column-title'>
          <input className='column-title-tag' type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" />
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
      
    )
  }
});

React.renderComponent(
  <ColumnList />,
  document.getElementById('react-content')
)