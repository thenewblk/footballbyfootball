/**
 * @jsx React.DOM
 */

var React = require('react'),
    util = require('util');

require('../trumbowyg.js');
require('../trumbowyg.colors.js');


// removes MS Office generated guff
// function cleanHTML(input) {
//   // 1. remove line breaks / Mso classes
//   var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g; 
//   var output = input.replace(stringStripper, ' ');
//   // 2. strip Word generated HTML comments
//   var commentSripper = new RegExp('<!--(.*?)-->','g');
//   var output = output.replace(commentSripper, '');
//   var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>','gi');
//   // 3. remove tags leave content if any
//   output = output.replace(tagStripper, '');
//   // 4. Remove everything in between and including tags '<style(.)style(.)>'
//   var badTags = ['style', 'script','applet','embed','noframes','noscript'];

//   for (var i=0; i< badTags.length; i++) {
//     tagStripper = new RegExp('<'+badTags[i]+'.*?'+badTags[i]+'(.*?)>', 'gi');
//     output = output.replace(tagStripper, '');
//   }
//   // 5. remove attributes ' style="..."'
//   var badAttributes = ['style', 'start'];
//   for (var i=0; i< badAttributes.length; i++) {
//     var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"','gi');
//     output = output.replace(attributeStripper, '');
//   }
//   return output;
// }

var Column = React.createClass({
  
  getInitialState: function() {
    return {active: false, super_key: this.props.thing_id, editor: {}};
  },

  componentWillMount: function() { 
    var self = this;
    var value = this.props.thing; 

    self.setState({content: value });

    // self.setState({content: cleanHTML(value) });

    // self.props.content({ id: self.props.identifier, content: cleanHTML(value) });
  },

  // cleanHtml: function() { 
  //   var self = this;
  //   var super_key = this.state.super_key;

  //   var tmp_content = $('#main-content-'+super_key).trumbowyg('html');
  //   console.log('tmp_content: ' + tmp_content);
  //   var cleaned_content = cleanHTML(tmp_content);
  //   console.log('cleaned_content: ' + cleaned_content);

  //   self.setState({content: cleaned_content });
    
  //   self.props.content({ id: self.props.identifier, content: cleaned_content });

  // },

  componentDidMount: function(){
    var self = this;
    var super_key = this.state.super_key;
    var value = this.state.content; 
    var editor = $('#main-content-'+super_key).trumbowyg({
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
      // var cleaned_html = cleanHTML($('#main-content-'+super_key).trumbowyg('html'));
      // self.setState({ content: cleaned_html });
      // self.props.content({ id: self.props.identifier, content: cleaned_html });

      self.props.content({ id: self.props.identifier, content:  $('#main-content-'+super_key).trumbowyg('html') });
    });

    self.setState({ editor: editor })
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