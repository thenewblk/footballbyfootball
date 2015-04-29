/**
 * @jsx React.DOM
 */

var React = require('react'),
    request = require('superagent'),
    moment = require('moment'),
    Audio5js = require('./audio5.js'),
    util = require('util');

var Podcast = React.createClass({  
  getInitialState: function() {
    return { url: '', title: '', player: {}, progress: "", duration: "" };
  },

  componentWillMount: function(){
    var self = this;

    var audioReady = function () {
      this.load('http://www.blogtalkradio.com/footballbyfootball/2015/04/22/the-challenges-nfl-players-face-changing-positions-scheme.mp3?localembed=download');
      // var play_pause = document.getElementById('play-pause');
      // play_pause.addEventListener('click', playPause.bind(this));
      // var move_to_start = document.getElementById('move-to-start');
      // move_to_start.addEventListener('click', moveToStart.bind(this));

      // timeupdate event passes audio duration and position to callback
      this.on('timeupdate', function (position, duration) {
        var total = moment.duration(duration, "s");
        self.setState({progress: position, duration: total.minutes() + ":" + total.seconds() });
      }, this);
    
    }

    var initAudio = function () {
      var audio5js = new Audio5js({
        swf_path: '/js/audio5js.swf',
        throw_errors: true,
        format_time: true,
        ready: audioReady
      });

      self.setState({player: audio5js}); 


    }

    initAudio();
  },


  playPause: function () {
    var self = this;
    if (self.state.player.playing) {
      self.state.player.pause();
      self.state.player.volume(0);
      console.log(self.state.player.position, self.state.player.duration, self.state.player.load_percent, self.state.player.volume());
    } else {
      self.state.player.play();
      self.state.player.volume(1);
    }
    // or simply call self.state.player.playPause();
  },

  moveToStart: function () {
    var self = this;
    self.state.player.seek(0);
  },

  render: function() {
    var self = this;
    var url = self.state.url,
        title = self.state.title,
        progress = self.state.progress,
        duration = self.state.duration;


    return (
      <div className="container">
        <p><span onClick={self.playPause}>Play/Pause</span>
        <span onClick={self.moveToStart}>Reset</span>
        <span>{progress} / {duration}</span></p>
      </div>
      
    )
  }
});



React.renderComponent(
  Podcast(),
  document.getElementById('podcast')
)