/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('./ReactScriptLoader.js');
var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var mainEditor = [];

var Column = React.createClass({
  

  mixins: [ReactScriptLoaderMixin],

  getInitialState: function() {
    return {active: false};
  },

  componentWillMount: function() {
    mainEditor[this.props.identifier];
  },

  componentDidUpdate: function() {
    if ( this.props.thing.length > 0 ) {
      mainEditor[this.props.identifier].setValue(this.props.thing, true);
    }
  },

  handleChange: function(event) {
    this.props.content({content: this.refs.content.getDOMNode().value });
  },

  handleClose: function() {
    this.props.removed({id: this.props.identifier});
    // this.refs.contentwrapper.getDOMNode().remove();
  },

  getScriptURL: function() {
    return '/js/wysihtml5-0.3.0.js';
  },

  onScriptLoaded: function() {
    var self = this;
    var identifier = this.props.identifier;
    var wysihtml5ParserRules = require('./advanced.js');
    mainEditor[self.props.identifier] = new wysihtml5.Editor('main-content-'+identifier, {
      toolbar:      "main-toolbar-"+identifier,
      stylesheets:  "/css/wysihtml5.css",
      parserRules:  wysihtml5ParserRules,
      cleanUp:              false
    });

    mainEditor[self.props.identifier].observe("load", function () {     
      var $iframe = $(this.composer.iframe);
      var $body = $(this.composer.element);
      
      $body
        .css({
          'min-height': 0,
          'line-height': '20px',
          'overflow': 'hidden',
        })
        .bind('keypress keyup keydown paste change focus blur', function(e) {
          var height = Math.min($body[0].scrollHeight, $body.height());
          // a little extra height to prevent spazzing out when creating newlines
          // var extra = e.type == "blur" ? 0 : 20 ;
          var extra = 20 ;
          $iframe.height(height + extra);
        });
        // mainEditor[self.props.identifier].setValue(self.props.value, true);
    });

    function onFocus() { 
      self.setState({active: true});
    };
    
    mainEditor[self.props.identifier].on("focus", onFocus);

    function onBlur() { 
      self.setState({active: false});
    };

    mainEditor[self.props.identifier].on("blur", onBlur);

    function onChange() { 
      self.props.content({id: self.props.identifier, content: mainEditor[self.props.identifier].getValue()});
    };
    mainEditor[self.props.identifier].on("change", onChange);

  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  theValue: function (){
    return this.refs.content.getDOMNode().value;
  },

  render: function() {
    var className = this.state.active ? 'content-container active' : 'content-container';
    return ( 
      <div className={className} ref='contentwrapper'>
        <div className="post-form">
          <div id={'main-toolbar-'+this.props.identifier} className="toolbar">
            <span className="section">
              <a className="fa fa-bold" data-wysihtml5-command="bold" title="CTRL+B"></a>
              <a className="fa fa-italic" data-wysihtml5-command="italic" title="CTRL+I"></a>
            </span>
            <span className="section">
              <a className="fa fa-link" data-wysihtml5-command="createLink"></a> 
              <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1">h1</a> 
              <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2">h2</a> 
            </span>
            <span className="section">
              <a className="fa fa-list-ul" data-wysihtml5-command="insertUnorderedList"></a> 
              <a className="fa fa-list-ol" data-wysihtml5-command="insertOrderedList"></a> 
            </span>
            <span className="section">
              <a className="fa fa-align-left" data-wysihtml5-command="justifyLeft"></a> 
              <a className="fa fa-align-center" data-wysihtml5-command="justifyCenter"></a> 
              <a className="fa fa-align-right" data-wysihtml5-command="justifyRight"></a> 
            </span>
            <span className="section">
              <a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" className="color red"></a> 
              <a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="dark" className="color dark"></a> 
            </span>
          </div>
          <a className="close-link" onClick={this.handleClose}>×</a>
          <textarea ref='content' id={'main-content-'+this.props.identifier} className="main content" name="content" placeholder='Type New Content Here...'></textarea>
        </div>
      </div> )
  }
});

module.exports = Column;