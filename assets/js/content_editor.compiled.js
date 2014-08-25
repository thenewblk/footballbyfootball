(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

 var ContentEditor = React.createClass({displayName: 'ContentEditor',
  render: function() {
    return ( 
      React.DOM.form({id: "content-container", className: "post-form", method: "post", 'accept-charset': "utf-8"}, 
        React.DOM.h3({className: "form-label"}, "Content"), 
          React.DOM.div({id: "main-toolbar", className: "toolbar"}, 
            React.DOM.span({className: "section"}, 
              React.DOM.a({className: "fa fa-bold", 'data-wysihtml5-command': "bold", title: "CTRL+B"}), 
              React.DOM.a({className: "fa fa-italic", 'data-wysihtml5-command': "italic", title: "CTRL+I"})
            ), 
            React.DOM.span({className: "section"}, 
              React.DOM.a({className: "fa fa-link", 'data-wysihtml5-command': "createLink"}), 
              React.DOM.a({'data-wysihtml5-command': "formatBlock", 'data-wysihtml5-command-value': "h1"}, "h1"), 
              React.DOM.a({'data-wysihtml5-command': "formatBlock", 'data-wysihtml5-command-value': "h2"}, "h2")
            ), 
            React.DOM.span({className: "section"}, 
              React.DOM.a({className: "fa fa-list-ul", 'data-wysihtml5-command': "insertUnorderedList"}), 
              React.DOM.a({className: "fa fa-list-ol", 'data-wysihtml5-command': "insertOrderedList"})
            ), 
            React.DOM.span({className: "section"}, 
              React.DOM.a({className: "fa fa-align-left", 'data-wysihtml5-command': "justifyLeft"}), 
              React.DOM.a({className: "fa fa-align-center", 'data-wysihtml5-command': "justifyCenter"}), 
              React.DOM.a({className: "fa fa-align-right", 'data-wysihtml5-command': "justifyRight"})
            ), 
            React.DOM.span({className: "section"}, 
              React.DOM.a({'data-wysihtml5-command': "foreColor", 'data-wysihtml5-command-value': "red", className: "color red"}), 
              React.DOM.a({'data-wysihtml5-command': "foreColor", 'data-wysihtml5-command-value': "dark", className: "color dark"})
            )
            
          ), 
        React.DOM.textarea({id: "main-content", className: "main content", name: "content"}), 
        React.DOM.input({className: "submit", type: "submit", value: "Submit"})
      ) 
    )
  }
})

module.export = ContentEditor;
},{}]},{},[1]);
