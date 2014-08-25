/**
 * @jsx React.DOM
 */

var React = require('react');

var Column = require('./contentEditor.jsx');

var ColumnList = React.createClass({  
    render: function() {
      var self = this;
      var columns = this.props.data.map(function(column, index) {
        return <Column content={column.contet} identifier={index}/>;
      });
      return (
        <div className="column-content">
          {columns}
        </div>
      )
        
    }
});

var ColumnBox = React.createClass({
  getInitialState: function() {
    return { data: []};
  },
  addContent: function(){
    var current_data = this.state.data;
    var tmp_column = { content: 'Type New Content Here...' };
    var new_data = current_data.concat(tmp_column);
    this.setState({data: new_data})
  },
  render: function(){
    return (    
      <div>
        <ColumnList data={this.state.data} />
        <p onClick={this.addContent}>Add Content</p>
      </div>
      )
  }
})

React.renderComponent(
  <ColumnBox />,
  document.getElementById('react-content')
)