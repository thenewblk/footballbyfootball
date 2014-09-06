/**
 * @jsx React.DOM
 */

var Data = window.Data || {};

console.log('Data: ' + Data);

var React = require('react');

var World = React.createClass({
    render: function() {
        return <strong>{this.props.data}</strong>;
    }
});

var Hello = React.createClass({
    clickHandler: function() {
        this.setProps({
            name: 'earth' 
        });
    },
    render: function() {
        console.log(this.props.name);
        return (
            <div>
                Hello <World data={this.props.name} />
                <button onClick={this.clickHandler}>Click me</button>
            </div>
        );
    }
});

React.renderComponent(Hello(Data), document.getElementById('content'));