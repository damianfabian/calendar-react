import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.css'

class Event extends Component {
    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                <h1>{this.props.title}</h1>
                <span className="desc">{this.props.desc}</span>
            </div>
        );
    }
}

Event.propTypes = {
    style : PropTypes.object,
    title : PropTypes.string,
    desc : PropTypes.string,
    className : PropTypes.string,
}

Event.defaultProps = {
    title: 'Event',
    desc: 'Description',
    className: 'event',
};

export default Event