import React, { Component } from 'react';
import PropTypes from 'prop-types';

const TIME_FORMAT = {
    'NORMAL': '12H',
    'ARMY': '24H'
}

class Calendar extends Component {
    
    // Function to render the Ruler and the Calendar Background
    // The function receive 2 params
    // Params: 
    // start (Integer) => Expect the value to start the calendar. ex: 900 is 9:00AM
    // end (Integer) => Expect the last value for the calendar. ex: 2100 is 9:00PM
    buildCalendar (start, end) {
        let current = start
        let output = []

        while(current <= end) {
            const last = current === end
            const lastHour = last ? <time>{this.getHourLabel(end)}</time> : null

            // This function could be improved in case the Ruler needs to display diferent ranges
            // to keep it simple, I'm displaying values every 30 minutes
            output.push(<li key={current}>
                <div className="time">
                    <time>{this.getHourLabel(current)}</time>
                    <subtime>{this.getHourLabel(current + 30, false)}</subtime>
                    {lastHour}
                </div>
                <div className={`${this.props.classBlock} ${last ? 'last' : ''}`} data-hour={current}></div>
            </li>)
            // All the values expected here are based 100, so, to increase the hour we need 100
            // ex: 900 is 9:00AM, 1000 is 10:00AM, etc.
            current+= 100
        }
        return output
    }

    // Function to render the Time labels based on configuration format
    // Params:
    // hour (Integer) => Expecte values like 900, 2200, 1500.
    // showMeridiam (Bool) => Flag to hide the meridiam for Time like 930, 1030
    // I thought about to use moment.js but It was to simple that I prefer make something
    // by myself
    getHourLabel (hour, showMeridiam = true) {
        const format = this.props.config.format
        const h = Math.floor(hour/100)
        const m = hour % 100
        switch (format) {
            case TIME_FORMAT.NORMAL:
                const meridiam = h >= 12 ? 'PM' : 'AM'
                return `${h > 12 ? h - 12 : h}:${m === 0 ? '00' : m} ${showMeridiam ? meridiam : ''}`
            case TIME_FORMAT.ARMY:
                return `${h}:${m === 0 ? '00' : m}`
        }
    }

    render() {
        return (
            <ul className={this.props.classContainer}>
                { this.buildCalendar(this.props.config.start, this.props.config.end) }
            </ul>
        );
    }
}

Calendar.propTypes = {
    config: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        format: PropTypes.oneOf(['12H', '24H']),
    }),
    
    classContainer: PropTypes.string,
    classBlock: PropTypes.string
};

Calendar.defaultProps = {
    config: {
        start: 900,
        end: 2100,
        format: TIME_FORMAT.NORMAL
    },
    classBlock: 'hour'
}

export default Calendar;