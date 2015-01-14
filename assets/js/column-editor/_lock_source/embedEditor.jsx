/**
 * @jsx React.DOM
 */

var React = require('react');

var util = require('util');

var Textarea = require('react-textarea-autosize');

var Embed = React.createClass({

  getInitialState: function() {
    return { content: '' };
  },

  componentWillMount: function() {
  },

  handleClose: function() {
    this.props.removed({id: this.props.identifier});
  },

  handleSwapPrevious: function() {
    this.props.swap_previous({id: this.props.identifier});
  },

  handleSwapNext: function() {
    this.props.swap_next({id: this.props.identifier});
  },

  theValue: function (){
    return this.refs.content.getDOMNode().value;
  },

  handleChange: function(event){
    this.props.content({id: this.props.identifier, content: event.target.value});
  },

  render: function() {
    var self = this;
    var value = this.props.thing; 

    return ( 
      <div className='content-container' ref='contentwrapper'>
        <div className="post-form">
          <div className="position-control">
            <span className="move up" onClick={this.handleSwapPrevious}></span>
            <span className="move down" onClick={this.handleSwapNext}></span>
          </div>
          <a className="close-link" onClick={this.handleClose}>×</a>
          <Textarea className="embed-area" onChange={this.handleChange}>{value}</Textarea>
        </div>
      </div> )
  }
});

module.exports = Embed;