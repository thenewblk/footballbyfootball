/**
 * @jsx React.DOM
 */

var React = require('react'),
    util = require('util');

require('../trumbowyg.js');
require('../trumbowyg.colors.js');

var Column = React.createClass({
  
  getInitialState: function() {
    return {active: false, super_key: this.props.thing_id, editor: {}};
  },

  componentWillMount: function() { },

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
           '|', 'horizontalRule', 'foreColor']
    });
    $('#main-content-'+super_key).trumbowyg('html', value);

    $('#main-content-'+super_key).trumbowyg().on('tbwfocus', function(){ console.log('Focus!'); });  
    $('#main-content-'+super_key).trumbowyg().on('tbwblur', function(){ 
      console.log('Blur!'); 
      self.props.content({id: self.props.identifier, content: $('#main-content-'+super_key).trumbowyg('html')});
    });
  },

  // componentDidUpdate: function(){
  //   var self = this;
  //   var super_key = this.state.super_key;
  //   var value = this.props.thing; 
  //   $('#main-content-'+super_key).trumbowyg({
  //       autogrow: true,
  //       fullscreenable: false,
  //       btns: ['viewHTML',
  //          '|', 'formatting',
  //          '|', jQuery.trumbowyg.btnsGrps.semantic,
  //          '|', 'link',
  //          '|', jQuery.trumbowyg.btnsGrps.justify,
  //          '|', jQuery.trumbowyg.btnsGrps.lists,
  //          '|', 'horizontalRule', 'foreColor']
  //   });
  //   $('#main-content-'+super_key).trumbowyg('html', value);

  //   $('#main-content-'+super_key).trumbowyg().on('tbwfocus', function(){ console.log('Focus!'); });  
  //   $('#main-content-'+super_key).trumbowyg().on('tbwblur', function(){ 
  //     console.log('Blur!'); 
  //     self.props.content({id: self.props.identifier, content: $('#main-content-'+super_key).trumbowyg('html')});
  //   });
  // },

  handleClose: function() {
    this.props.removed({id: this.props.identifier});
  },

  handleSwapPrevious: function() {
    this.props.swap_previous({id: this.props.identifier});
  },

  handleSwapNext: function() {
    this.props.swap_next({id: this.props.identifier});
  },

  render: function() {
    var self = this; 
    var super_key = this.state.super_key;

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