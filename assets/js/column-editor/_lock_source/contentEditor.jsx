/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('../ReactScriptLoader.js');
var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var util = require('util');

var mainEditor = [];

var Column = React.createClass({
  

  mixins: [ReactScriptLoaderMixin],

  getInitialState: function() {
    return {active: false, super_key: this.props.thing_id, editor: {}};
  },

  componentWillMount: function() {
    var self = this;
    mainEditor[self.state.super_key];
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

  getScriptURL: function() {
    return '/js/wysihtml5x.js';
  },

  onScriptLoaded: function() {

    var self = this;
    var entry = this.props.entry;
    var identifier = this.props.identifier;
    var super_key = this.state.super_key;
    // require('../rangy.js');
    // require('../wysihtml5x-toolbar.js');
    var wysihtml5ParserRules = require('../advanced.js');

    mainEditor[super_key] = new wysihtml5.Editor('main-content-'+super_key, {
      toolbar:      "main-toolbar-" + super_key,
      stylesheets:  "/css/wysihtml5.css",
      parserRules:  wysihtml5ParserRules
    });

    mainEditor[super_key].on("load", function () { 

      var $iframe = $(this.composer.iframe);
      var $body = $(this.composer.element);
      
      $body
        .css({
          'min-height': 0,
          'overflow': 'hidden',
        })
        // .bind('keypress keyup keydown paste change focus blur load', function(e) {
        //   var height = Math.min($body[0].scrollHeight, $body.height());
        //   var extra = 25 ;
        //   $iframe.height(height + extra);
        // })
        ;
    });

    function onFocus() { 
      self.setState({active: true});
    };
    
    mainEditor[super_key].on("focus", onFocus);

    function onBlur() { 
      self.setState({active: false});
    };

    mainEditor[super_key].on("blur", onBlur);

    function onChange() { 
      var stuff = mainEditor[super_key].getValue();
      self.props.content({id: self.props.identifier, content: mainEditor[super_key].getValue()});
    };

    mainEditor[super_key].on("change", onChange);

    // function onLoad() { 
    //   mainEditor[super_key].on("load", function () {     
    //     var $iframe = $(this.composer.iframe);
    //     var $body = $(this.composer.element);
        
    //     var height = Math.min($body[0].scrollHeight, $body.height());
    //     var extra = 25 ;
    //     $iframe.height(height + extra);
    //   });

    // };

    // mainEditor[super_key].on("load", onLoad);

    self.setState({ editor: mainEditor[super_key] });
  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  theValue: function (){
    return this.refs.content.getDOMNode().value;
  },

  render: function() {
    var self = this;
    var entry = this.props.entry;
    var value = this.props.thing; 
    var super_key = this.state.super_key;
    var className = this.state.active ? 'content-container active' : 'content-container';

    if (self.state.editor.setValue) {
      self.state.editor.setValue(self.props.thing);
    }
    var divStyle = {
      display: 'none',
    }

    return ( 
      <div className={className} ref='contentwrapper'>
        <div className="post-form">
          <div id={'main-toolbar-'+super_key} className="toolbar">
            <span className="section">
              <a className="fa fa-bold" data-wysihtml5-command="bold" title="CTRL+B"></a>
              <a className="fa fa-italic" data-wysihtml5-command="italic" title="CTRL+I"></a>
            </span>
            <span className="section">
              <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="p">p</a> 
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
              <a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="black" className="color dark"></a> 
            </span>
            <span className="section">
              <a className="fa fa-minus" data-wysihtml5-command="insertHTML" data-wysihtml5-command-value="<hr>"></a>
              <a className="fa fa-quote-right" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="blockquote"></a>
            </span>
            <span className="section">
              <a className="fa fa-link" data-wysihtml5-command="createLink"></a>
              <a className="fa fa-unlink" data-wysihtml5-command="removeLink"></a>
              
            </span>
            <div className="link_dialog" data-wysihtml5-dialog="createLink" style={divStyle}>
              <span>Link:</span>
              <input data-wysihtml5-dialog-field="href" />
              <a data-wysihtml5-dialog-action="save">OK</a>
              <a data-wysihtml5-dialog-action="cancel">Cancel</a>
            </div>
             <div className="position-control">
              <span className="move up" onClick={this.handleSwapPrevious}></span>
              <span className="move down" onClick={this.handleSwapNext}></span>
            </div>
          </div>
          <a className="close-link" onClick={this.handleClose}>×</a>
          <div ref='content' id={'main-content-'+this.state.super_key} className="main content" name="content" placeholder='Type New Content Here...' value={value} readOnly></div>
        </div>
      </div> )
  }
});

module.exports = Column;