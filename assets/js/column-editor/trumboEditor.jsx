/**
 * @jsx React.DOM
 */

var React = require('react');

require('../trumbowyg.js');
require('../trumbowyg.colors.js');

var ReactScriptLoaderModule = require('../ReactScriptLoader.js');
var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var util = require('util');

var mainEditor = [];

var Column = React.createClass({
  

  // mixins: [ReactScriptLoaderMixin],

  getInitialState: function() {
    return {active: false, super_key: this.props.thing_id, editor: {}};
  },

  componentWillMount: function() {
    var self = this;
    mainEditor[self.state.super_key];
  },

  componentDidMount: function(){
    var self = this;
    var super_key = this.state.super_key;
    var value = this.props.thing; 
    $('#main-content-'+super_key).trumbowyg({
        autogrow: true,
        fullscreenable: false,
        btns: ['viewHTML',
           '|', 'formatting',
           '|', jQuery.trumbowyg.btnsGrps.semantic,
           '|', 'link',
           '|', jQuery.trumbowyg.btnsGrps.justify,
           '|', jQuery.trumbowyg.btnsGrps.lists,
           '|', 'insertHorizontalRule',
           '|', 'foreColor', 'backColor']
    });
    $('#main-content-'+super_key).trumbowyg('html', value);

    $('#main-content-'+super_key).trumbowyg().on('tbwfocus', function(){ console.log('Focus!'); });  
    $('#main-content-'+super_key).trumbowyg().on('tbwblur', function(){ 
      console.log('Blur!'); 
      self.props.content({id: self.props.identifier, content: $('#main-content-'+super_key).trumbowyg('html')});
    });
  },

  componentDidUpdate: function(){
    var self = this;
    var super_key = this.state.super_key;
    var value = this.props.thing; 
    $('#main-content-'+super_key).trumbowyg({
        autogrow: true,
        fullscreenable: false,
        btns: ['viewHTML',
           '|', 'formatting',
           '|', jQuery.trumbowyg.btnsGrps.semantic,
           '|', 'link',
           '|', jQuery.trumbowyg.btnsGrps.justify,
           '|', jQuery.trumbowyg.btnsGrps.lists,
           '|', 'insertHorizontalRule',
           '|', 'foreColor', 'backColor']
    });
    $('#main-content-'+super_key).trumbowyg('html', value);

    $('#main-content-'+super_key).trumbowyg().on('tbwfocus', function(){ console.log('Focus!'); });  
    $('#main-content-'+super_key).trumbowyg().on('tbwblur', function(){ 
      console.log('Blur!'); 
      self.props.content({id: self.props.identifier, content: $('#main-content-'+super_key).trumbowyg('html')});
    });
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

  changeHandler: function(){
    console.log('fuck you');
  },

  // getScriptURL: function() {
  //   return '/js/trumbowyg.js';
  // },

  // onScriptLoaded: function() {

  //   var self = this;
  //   var entry = this.props.entry;
  //   var identifier = this.props.identifier;
  //   var super_key = this.state.super_key;

  //   var value = this.props.thing; 
    // require('../rangy.js');
    // require('../wysihtml5x-toolbar.js');
    // var wysihtml5ParserRules = require('../advanced.js');

    // mainEditor[super_key] = new wysihtml5.Editor('main-content-'+super_key, {
    //   toolbar:      "main-toolbar-" + super_key,
    //   stylesheets:  "/css/wysihtml5.css",
    //   parserRules:  wysihtml5ParserRules
    // });

    // mainEditor[super_key].on("load", function () { 

    //   var $iframe = $(this.composer.iframe);
    //   var $body = $(this.composer.element);
      
    //   $body
    //     .css({
    //       'min-height': 0,
    //       'overflow': 'hidden',
    //     })
    //     // .bind('keypress keyup keydown paste change focus blur load', function(e) {
    //     //   var height = Math.min($body[0].scrollHeight, $body.height());
    //     //   var extra = 25 ;
    //     //   $iframe.height(height + extra);
    //     // })
    //     ;
    // });

    // function onFocus() { 
    //   self.setState({active: true});
    // };
    
    // mainEditor[super_key].on("focus", onFocus);

    // function onBlur() { 
    //   self.setState({active: false});
    // };

    // mainEditor[super_key].on("blur", onBlur);

    // function onChange() { 
    //   var stuff = mainEditor[super_key].getValue();
    //   self.props.content({id: self.props.identifier, content: mainEditor[super_key].getValue()});

    //   console.log('selection: '+util.inspect(mainEditor[super_key]));
    // };

    // mainEditor[super_key].on("change", onChange);

    // self.setState({ editor: mainEditor[super_key] });
  // },
 
  // onScriptError: function() {
  //     alert('Script Load Error');
  // },

  theValue: function (){
    return this.refs.content.getDOMNode().value;
  },

  render: function() {
    var self = this;
    var entry = this.props.entry;
    var value = this.props.thing; 
    var super_key = this.state.super_key;

    if (self.state.editor.setValue) {
      self.state.editor.setValue(self.props.thing);
    }
    var divStyle = {
      display: 'none',
    }

    return ( 
      <div className='content-container' ref='contentwrapper'>
        <div className="post-form">
          <div className="position-control">
            <span className="move up" onClick={self.handleSwapPrevious}></span>
            <span className="move down" onClick={self.handleSwapNext}></span>
          </div>
          <a className="close-link" onClick={self.handleClose}>×</a>
          <div id={'main-content-'+super_key} className="main content" placeholder='Type New Content Here...'></div>
        </div>
      </div> )
  }
});

module.exports = Column;