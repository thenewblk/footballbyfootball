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
    return {
      url: '',
      title: '',
      updated_at: '',
      player: {},
      progress: "00:00",
      duration: "00:00",
      playing: false,
    };
  },

  componentWillMount: function(){
    var self = this;
    if(self.props.type == 'nfl') {
      request
        .get('/latest-nfl-podcast')
        .end(function(res) {
          var podcast = res.body[0];

          console.log('podcast.podcast: ' + podcast.podcast);
          var audioReady = function () {
            this.load(podcast.podcast);

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


            self.setState({ url: podcast.podcast, title: podcast.title, updated_at: podcast.updated_at, player: audio5js});
          }

          initAudio();




        }.bind(self));
      } else if ((self.props.type == 'college')){
        request
          .get('/latest-college-podcast')
          .end(function(res) {
            var podcast = res.body[0];

            console.log('podcast.podcast: ' + podcast.podcast);
            var audioReady = function () {
              this.load(podcast.podcast);

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


              self.setState({ url: podcast.podcast, title: podcast.title, updated_at: podcast.updated_at, player: audio5js});
            }

            initAudio();




          }.bind(self));
      } else {
        request
          .get('/latest-podcast')
          .end(function(res) {
            var podcast = res.body[0];

            console.log('podcast.podcast: ' + podcast.podcast);
            var audioReady = function () {
              this.load(podcast.podcast);

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


              self.setState({ url: podcast.podcast, title: podcast.title, updated_at: podcast.updated_at, player: audio5js});
            }

            initAudio();




          }.bind(self));
      }
  },


  playPause: function () {
    var self = this;
    if (self.state.player.playing) {
      self.state.player.pause();
      self.state.player.volume(0);
      self.setState({playing: false});
    } else {
      self.state.player.play();
      self.state.player.volume(1);
      self.setState({playing: true});
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
        duration = self.state.duration,
        playing = self.state.playing,
        playClass = '';
    if (playing) {
      playClass = "pause podcastbutton";
    } else {
      playClass = "play podcastbutton";
    }

    return (
      <div className="container">

        <h2 className="podcast_square_title">{title}</h2>
        <div className="podcast_play">
          <span className={playClass} onClick={self.playPause}></span>
          <span className="podcast_progress">{progress} | {duration}</span>
        </div>
      </div>

    )
  }
});



React.renderComponent(
  <Podcast type="nfl" />,
  document.getElementById('podcast_nfl')
)

React.renderComponent(
  <Podcast type="college" />,
  document.getElementById('podcast_college')
)
