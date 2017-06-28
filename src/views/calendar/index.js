import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './style.css'
import DayLayout from 'components/calendar'
import Event from 'components/event'


class CalendarView extends Component {
    constructor(props){
        super(props)

        this.state = {}
        // Expose function Globaly throught window Object
        window.layOutDay = this.layOutDay.bind(this)
    }

    //Function to receive calls from Global Object
    layOutDay (events){
        //Normalize array to identify every event
        const _data = events.map((item, i) => {item.id = i; return item})
        //Sort all the events to get the early events first
        _data.sort((a,b) => { return a.start > b.start ? 1 : -1 })

        this.setState({
            events: this.buildEvents(_data)
        })
    }

    componentDidMount() {
        // Call buildEvents only when the componen is already mounted
        // I'm using document.querySelector so this is a MUST do.
        const _data = this.props.data.map((item, i) => {item.id = i; return item})
        _data.sort((a,b) => { return a.start > b.start ? 1 : -1 })

        this.setState({
            events: this.buildEvents(_data)
        })
    }

    // Function to render all the events on the screem, the function receives an Array of Events
    // params:
    // events (Array) => Expect a valid array with this structure { start: 30, end: 40 }
    buildEvents (events) {
        // Calendar Container
        const container = document.querySelector('.timeline')
        // First row in the calendar, It represent a block of one hour
        const bodyTimeline = document.querySelector('.hour')
        const _containerTop = container.offsetTop
        const _containerLeft = container.offsetLeft
        // Every block has 600 wide and 20 of padding, I add 20 to define
        // where the events should start the rendering. It means 10px more padding of the block
        const _eventLeft = bodyTimeline.offsetLeft + 20
        // This is the full width per block in the calendar, I remove 30 cause the block
        // has 10px padding from block, 10px padding from the beginning to render events
        // and 10px padding at the end of the block
        const width = bodyTimeline.clientWidth - 30

        // Create clean copy of events
        let queue = events.slice()
        // Flag to know where side is being render, the calendar by conception has 2 sides
        // I mean by side the level of events, early(left) and late(right) compare with time
        let side = true
        const output = []
        // Object to have a fast validation of which events have been added to render
        const added = {}

        while(queue.length > 0) {
            // Get the first element on the array
            const event = queue.shift()
            // Get all the events that has the same start of time
            const collide = events.filter(ev => {
                return ev.id != event.id && ev.start == event.start
            })
            // Get the previuos events that collide with the current event sort by left property
            const previousEvent = events.filter(a => a.end >= event.start && a.end < event.end)
                                         .sort((a, b) => { return a.left > b.left ? -1 : 1 })
            // Get the next events that collide with the current event
            const nextEvent = events.filter(a => a.start > event.start && a.start <= event.end)
                                         .sort((a, b) => { return a.start > b.start ? 1 : -1 })
            // temporal variables in case I need to change them
            let _tempWidth = width
            let _tempLeft = _eventLeft
            // If there is any previous event, we need to calculate the space available to render
            // the current event with the same with of previous event
            if(previousEvent.length > 0) {
                // Get the width of the latest previous event
                const prevWidth = added[previousEvent[0].id].width
                // Calculate how much space took the previous level in comparation with the total
                // width available. After get the value I need to rest 10px per event cause the 
                // padding.
                _tempWidth = ( ((width / prevWidth) - previousEvent.length) * prevWidth ) - 
                             (previousEvent.length > 1 ? previousEvent.length + 1 : previousEvent.length) * 10 
                // Calculate where should start the event to be rendered, the side flag tell me if
                // It's going to be render left (_tempLeft) or right (Previous left)
                _tempLeft = side ? added[previousEvent[0].id].left + prevWidth + 10 : _tempLeft
                // If there is a previous event we need to change the flag
                side = !side
            } else {
                // If there is not a previous event set as default true, 
                // It means start always from left
                side = true
            }

            // Add the current event to the collide array to handle only one iteration
            collide.splice(0,0,event)
            // Init the number of places we need to render base on the number of Events
            let places = collide.length
            // If there is any next element colliding with the current, let space for it
            if (nextEvent.length > 0 && side && previousEvent.length == 0) {
                places++
            }
            // This variable handle the position for the events at same time (0,1,2)
            //  to move the event to their left
            let nuItem = 0
            collide.map((item) => {
                // Calculated the position of the event to create his style
                let top = item.start + _containerTop
                const height = item.end - item.start
                const _width = _tempWidth/places - (nuItem > 0 && 10)
                const left = _tempLeft + ((_tempWidth/places * nuItem)) + (nuItem > 0 && 10)
                const css = {top: top, height: height, left: left, width: _width}
                // If the event is already added don't added again.
                if(!added[item.id]) {
                    output.push(<Event key={`event${item.id}`} style={css} 
                                       className="event" 
                                       title="Event" 
                                       desc="Sample Location" />)

                    added[item.id] = Object.assign(item, {width: _width, left: left})
                    nuItem++
                }
            })
            // Remove from the queue the events that has been added
            queue = queue.filter(item => collide.findIndex(_i => _i.id === item.id) === -1)
        }

        return output
    }

    render () {
        return <div className={`timeline ${this.props.className}`}>
            <DayLayout config={this.props.config} />
            {this.state.events}
        </div>
    }
}

CalendarView.propTypes = {
    className : PropTypes.string,
    config: PropTypes.object,
    data: PropTypes.array
}

CalendarView.defaultProps = {
    data: []
}

export default CalendarView
