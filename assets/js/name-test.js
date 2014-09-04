/**
 * @jsx React.DOM
 */

var React = require('react');

var World = React.createClass({
    render: function() {
        return <strong>{this.props.data.name}</strong>;
    }
});

var Hello = React.createClass({
    clickHandler: function() {
        this.setProps({
            data: { name: 'earth' }
        });
    },
    render: function() {
        return (
            <div>
                Hello <World data={this.props.data} />
                <button onClick={this.clickHandler}>Click me</button>
            </div>
        );
    }
});

module.exports = Hello;