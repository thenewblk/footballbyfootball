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

  // componentDidMount: function(){
  //   var self = this;
  //   var super_key = this.state.super_key;
  //   self.props.thing_un_moved({id: super_key});
  // },

  // componentDidUpdate: function(){
  //   var self = this;
  //   var super_key = this.state.super_key;
    
  //   if (this.props.thing_moved) {


  //     console.log('getValue: '+self.state.editor.getValue());

  //   }
      // var identifier = this.props.identifier;
      // var wysihtml5ParserRules = require('../advanced.js');

      // self.state.editor = new wysihtml5.Editor('main-content-'+super_key, {
      //   toolbar:      "main-toolbar-" + super_key,
      //   stylesheets:  "/css/wysihtml5.css",
      //   parserRules:  wysihtml5ParserRules,
      //   cleanUp:      true
      // });

      // self.state.editor.on("load", function () { 

      //   var $iframe = $(this.composer.iframe);
      //   var $body = $(this.composer.element);
        
      //   $body
      //     .css({
      //       'min-height': 0,
      //       'overflow': 'hidden',
      //     })
      //     .bind('keypress keyup keydown paste change focus blur load', function(e) {
      //       var height = Math.min($body[0].scrollHeight, $body.height());
      //       var extra = 25 ;
      //       $iframe.height(height + extra);
      //     });
      // });


      // console.log('self.props.thing: '+self.props.thing);

      // self.state.editor.setValue(self.props.thing);

      // console.log('self.state.editor.getValue(): '+self.state.editor.getValue());
      // if (this.props.thing_moved){
      //   var super_key = this.state.super_key;
      //   mainEditor[super_key].setValue(this.props.thing, true);
      //   console.log(' (moved): '+this.state.super_key);

      // } else {
      //   var super_key = this.state.super_key;
      //   mainEditor[super_key].setValue(this.props.thing, true);
      //   console.log(" (didn't move): "+this.state.super_key);
      // }



      // this.handleDelete;
      // var random = Math.floor(Math.random() * (999999 - 100000) + 100000);
      // var self = this;
      // var super_key = this.state.super_key;

      // // self.props.editor.disable();

      // console.log('self.props.editor: ' + self.state.editor);


      // // $( "#main-content-"+super_key ).next('input[type=hidden]').remove();
      // // $( "#main-content-"+super_key ).next('iframe.wysihtml5-sandbox').remove();

      // // this.handleReRender;

      // // console.log(mainEditor[super_key]);

      // var entry = this.props.entry;
      // var identifier = this.props.identifier;
      // var wysihtml5ParserRules = require('../advanced.js');

      // self.state.editor = new wysihtml5.Editor('main-content-'+super_key, {
      //   toolbar:      "main-toolbar-" + super_key,
      //   stylesheets:  "/css/wysihtml5.css",
      //   parserRules:  wysihtml5ParserRules,
      //   cleanUp:      true
      // });

      // self.state.editor.on("load", function () { 

      //   var $iframe = $(this.composer.iframe);
      //   var $body = $(this.composer.element);
      //   console.log("mainEditor on load: "+ super_key + ' - ' + $iframe);
      //   $iframe
      //     .css({
      //       'display':'inline-block'
      //     });
      //   $body
      //     .css({
      //       'min-height': 0,
      //       'overflow': 'hidden',
      //     })
      //     .bind('keypress keyup keydown paste change focus blur load', function(e) {
      //       var height = Math.min($body[0].scrollHeight, $body.height());
      //       var extra = 25 ;
      //       $iframe.height(height + extra);
      //     });
      //     // self.props.thing_un_moved({id: super_key});
      // });

      // function onFocus() { 
      //   self.setState({active: true});
      //   // self.props.thing_un_moved({id: super_key});
      // };
      
      // self.state.editor.on("focus", onFocus);

      // function onBlur() { 
      //   self.setState({active: false});
      //   // self.props.thing_un_moved({id: super_key});
      // };

      // self.state.editor.on("blur", onBlur);

      // function onChange() { 
      //   var stuff = self.state.editor.getValue();
      //   self.props.content({id: self.props.identifier, content: self.state.editor.getValue()});
      //   // self.props.thing_un_moved({id: super_key});
      // };

      // self.state.editor.on("change", onChange);

      // function onLoad() { 
      //   self.state.editor.on("load", function () {     
      //     var $iframe = $(this.composer.iframe);
      //     var $body = $(this.composer.element);
          
      //     var height = Math.min($body[0].scrollHeight, $body.height());
      //     var extra = 25 ;
      //     $iframe.height(height + extra);
      //     // self.props.thing_un_moved({id: super_key});
      //   });

      //   // $( "#main-content-"+super_key ).next().next().css('display','inline-block');
        
        
      // };

      // self.state.editor.on("load", onLoad);


      // // this.handleVisible;


      // // $( "#main-content-"+super_key ).next().next().css('display','inline-block');

      // // this.props.thing_un_moved({id: this.props.identifier});

      // // self.state.editor = self.state.editor;

      // self.props.thing_un_moved({id: super_key});
    // }
    

  // },

  setValue: function(){
    var self = this;
    self.state.editor.setValue(self.props.thing);

    console.log('setValue to '+self.state.editor.getValue());

  },

  handleDelete: function(){
    console.log('handleDelete');

    var self = this;
    var super_key = this.state.super_key;

    $( "#main-content-"+super_key ).next('input[type=hidden]').remove();
    $( "#main-content-"+super_key ).next('iframe.wysihtml5-sandbox').remove();
  },

  handleVisible: function(){
    console.log('handleVisible');
    var self = this;
    var super_key = this.state.super_key;
    $( "#main-content-"+super_key ).next().next().css('display','inline-block');
  },

  handleDup: function (){
    console.log('handleDup');
    var self = this;
    var super_key = this.state.super_key;
    mainEditor[super_key].setValue(this.props.thing, true);
  },

  handleReRender: function() {
    console.log('rerender');



    var self = this;
    var entry = this.props.entry;
    var identifier = this.props.identifier;
    var super_key = this.state.super_key;
    var wysihtml5ParserRules = require('../advanced.js');


    mainEditor[super_key] = new wysihtml5.Editor('main-content-'+super_key, {
      toolbar:      "main-toolbar-" + super_key,
      stylesheets:  "/css/wysihtml5.css",
      parserRules:  wysihtml5ParserRules,
      cleanUp:      true
    });

    mainEditor[super_key].on("load", function () { 

      var $iframe = $(this.composer.iframe);
      var $body = $(this.composer.element);
      
      $body
        .css({
          'min-height': 0,
          'overflow': 'hidden',
        })
        .bind('keypress keyup keydown paste change focus blur load', function(e) {
          var height = Math.min($body[0].scrollHeight, $body.height());
          var extra = 25 ;
          $iframe.height(height + extra);
        });
        self.props.thing_un_moved({id: super_key});
    });

    function onFocus() { 
      self.setState({active: true});
      self.props.thing_un_moved({id: super_key});
    };
    
    mainEditor[super_key].on("focus", onFocus);

    function onBlur() { 
      self.setState({active: false});
      self.props.thing_un_moved({id: super_key});
    };

    mainEditor[super_key].on("blur", onBlur);

    function onChange() { 
      var stuff = mainEditor[super_key].getValue();
      self.props.content({id: self.props.identifier, content: mainEditor[super_key].getValue()});
      self.props.thing_un_moved({id: super_key});
    };

    mainEditor[super_key].on("change", onChange);

    function onLoad() { 
      console.log(' onLoad ' + self.props.identifier);
      mainEditor[super_key].on("load", function () {     
        var $iframe = $(this.composer.iframe);
        var $body = $(this.composer.element);
        
        var height = Math.min($body[0].scrollHeight, $body.height());
        var extra = 25 ;
        $iframe.height(height + extra);
        self.props.thing_un_moved({id: super_key});
      });
      

    };

    mainEditor[super_key].on("load", onLoad);

    self.props.editor = mainEditor[super_key];

    self.props.thing_un_moved({id: super_key});
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
    return '/js/wysihtml5-0.3.0.js';
  },

  onScriptLoaded: function() {

    var self = this;
    var entry = this.props.entry;
    var identifier = this.props.identifier;
    var super_key = this.state.super_key;
    var wysihtml5ParserRules = require('../advanced.js');

    mainEditor[super_key] = new wysihtml5.Editor('main-content-'+super_key, {
      toolbar:      "main-toolbar-" + super_key,
      stylesheets:  "/css/wysihtml5.css",
      parserRules:  wysihtml5ParserRules,
      cleanUp:      true
    });

    mainEditor[super_key].on("load", function () { 

      var $iframe = $(this.composer.iframe);
      var $body = $(this.composer.element);
      
      $body
        .css({
          'min-height': 0,
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

    function onLoad() { 
      mainEditor[super_key].on("load", function () {     
        var $iframe = $(this.composer.iframe);
        var $body = $(this.composer.element);
        
        var height = Math.min($body[0].scrollHeight, $body.height());
        var extra = 25 ;
        $iframe.height(height + extra);
      });

    };

    mainEditor[super_key].on("load", onLoad);

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

    // console.log('self.state.editor: '+util.inspect(self.state.editor));
    if (self.state.editor.setValue) {
      self.state.editor.setValue(self.props.thing);
        var $iframe = $(self.state.editor.composer.iframe);
        var $body = $(self.state.editor.composer.element);
        
        var height = Math.min($body[0].scrollHeight, $body.height());
        var extra = 25 ;
        $iframe.height(height + extra);  
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
             <div className="position-control">
              <span className="move up" onClick={this.handleSwapPrevious}></span>
              <span className="move down"  onClick={this.handleSwapNext}></span>
            </div>
          </div>
          <a className="close-link" onClick={this.handleClose}>×</a>
          <textarea ref='content' id={'main-content-'+this.state.super_key} className="main content" name="content" placeholder='Type New Content Here...' value={value} readOnly></textarea>
        </div>
      </div> )
  }
});

module.exports = Column;