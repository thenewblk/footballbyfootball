/**
 * @jsx React.DOM
 */

var React = require('react');

var ReactScriptLoaderModule = require('./ReactScriptLoader.js');
var ReactScriptLoaderMixin= ReactScriptLoaderModule.ReactScriptLoaderMixin;
var ReactScriptLoader= ReactScriptLoaderModule.ReactScriptLoader;

var ContentEditor = React.createClass({

  mixins: [ReactScriptLoaderMixin],
  getScriptURL: function() {
    var wysihtml5URL = '/js/wysihtml5-0.3.0.js';
    
    return wysihtml5URL;
  },
  onScriptLoaded: function() {
    var identifier = this.props.identifier;
    var wysihtml5ParserRules = require('./advanced.js');
    var mainEditor = new wysihtml5.Editor('main-content-'+identifier, {
      toolbar:      "main-toolbar-"+identifier,
      stylesheets:  "/css/wysihtml5.css",
      parserRules:  wysihtml5ParserRules
    });
  },
 
  onScriptError: function() {
      alert('Script Load Error');
  },

  render: function() {
    return ( 
      <div className="content-container">
        <form id="content-container" className="post-form" method="post" accept-charset="utf-8">
          <h3 className="form-label">Content</h3>
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
          <textarea id={'main-content-'+this.props.identifier} className="main content" name="content">{this.props.content}</textarea>
        </form>  
      </div> )
  }
});

module.exports = ContentEditor;