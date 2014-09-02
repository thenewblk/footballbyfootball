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
    var tmp_content = {type: 'image' };
    var new_data = current_data.concat(tmp_content);
    this.setState({data: new_data});
  },

  handleImage: function(content){
    var old_data = this.state.data;
    old_data[content.id].image_url = content.image_url;
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

  submitContent: function(){
    var self = this;
    console.log('children: '+ self.state.data.length);
    for (var i = 0; i < self.state.data.length; i++) {
      console.log( ' data.content: '+ self.state.data[i].content );
    }
  },
  render: function() {
    var self = this;
    var columns = this.state.data.map(function(object, i) {
      if ( object.type == 'content' ) {
        return <Column key={'content-'+i} ref={'content-'+i} thing={object.content} content={self.handleContent} removed={self.removeContent} identifier={i}/>;
      }
      if ( object.type == 'image' ) {
        return <Image key={'content-'+i} image={object.image_url} identifier={i} content={self.handleImage} removed={self.removeImage}/>;
      }
    });
    return (
      <div className="container">
        <div className='column-title'>
          <input className='column-title-tag' type="text" name="title" placeholder="Title" />
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