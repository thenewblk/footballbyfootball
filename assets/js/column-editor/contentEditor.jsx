/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('../ReactScriptLoader.js');
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

  handleClose: function() {
    this.props.removed({id: this.props.identifier});
  },

  getScriptURL: function() {
    return '/js/wysihtml5-0.3.0.js';
  },

  onScriptLoaded: function() {
    var self = this;
    var entry = this.props.entry;
    var identifier = this.props.identifier;
    var wysihtml5ParserRules = require('../advanced.js');
    mainEditor[self.props.entry+'-'+self.props.identifier] = new wysihtml5.Editor('main-content-'+entry+identifier, {
      toolbar:      "main-toolbar-"+entry+identifier,
      stylesheets:  "/css/wysihtml5.css",
      parserRules:  wysihtml5ParserRules,
      cleanUp:      false
    });

    mainEditor[self.props.entry+'-'+self.props.identifier].observe("load", function () {     
      var $iframe = $(this.composer.iframe);
      var $body = $(this.composer.element);
      
      $body
        .css({
          'min-height': 0,
          'line-height': 2,
          'overflow': 'hidden',
        })
        .bind('keypress keyup keydown paste change focus blur load', function(e) {
          var height = Math.min($body[0].scrollHeight, $body.height());
          var extra = 25 ;
          $iframe.height(height + extra);
        });
    });

    function onFocus() { 
      self.setState({active: true});
    };
    
    mainEditor[self.props.entry+'-'+self.props.identifier].on("focus", onFocus);

    function onBlur() { 
      self.setState({active: false});
    };

    mainEditor[self.props.entry+'-'+self.props.identifier].on("blur", onBlur);

    function onChange() { 
      console.log('self.props.entry+self.props.identifier: '+self.props.entry+self.props.identifier);
      console.log('onChange() contentvalue: '+mainEditor[self.props.entry+'-'+self.props.identifier].getValue());
      self.props.content({id: self.props.identifier, content: mainEditor[self.props.entry+'-'+self.props.identifier].getValue()});
    };

    mainEditor[self.props.entry+'-'+self.props.identifier].on("change", onChange);

    function onLoad() { 

      mainEditor[self.props.entry+'-'+self.props.identifier].on("load", function () {     
        var $iframe = $(this.composer.iframe);
        var $body = $(this.composer.element);
        
        var height = Math.min($body[0].scrollHeight, $body.height());
        var extra = 25 ;
        $iframe.height(height + extra);
      });

    };

    mainEditor[self.props.entry+'-'+self.props.identifier].on("load", onLoad);

  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  theValue: function (){
    return this.refs.content.getDOMNode().value;
  },

  render: function() {
    var entry = this.props.entry;
    var value = this.props.thing; 
    var className = this.state.active ? 'content-container active' : 'content-container';
    return ( 
      <div className={className} ref='contentwrapper'>
        <div className="post-form">
          <div id={'main-toolbar-'+entry+this.props.identifier} className="toolbar">
            <span className="section">
              <a className="fa fa-bold" data-wysihtml5-command="bold" title="CTRL+B"></a>
              <a className="fa fa-italic" data-wysihtml5-command="italic" title="CTRL+I"></a>
            </span>
            <span className="section">
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
            <span className="section">
              <a className="fa fa-minus" data-wysihtml5-command="insertHTML" data-wysihtml5-command-value="<hr>"></a>
              <a className="fa fa-quote-right" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="blockquote"></a>
            </span>
          </div>
          <a className="close-link" onClick={this.handleClose}>×</a>
          <textarea ref='content' id={'main-content-'+entry+this.props.identifier} className="main content" name="content" placeholder='Type New Content Here...' value={value} readOnly></textarea>
        </div>
      </div> )
  }
});

module.exports = Column;