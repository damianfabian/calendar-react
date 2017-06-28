import React, { Component } from 'react'
import CalendarView from 'views/calendar'
import './app.css'

window.CONFIG = {
    start: 900,
    end: 2100,
    format: '12H'
}

const DEFAULT_DATA = [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}
]

class App extends Component {
    render () {
        return (
            <div className='container'>
                <div className="app-container">
                    <CalendarView className="calendar" config={window.CONFIG} data={DEFAULT_DATA} />
                </div>
            </div>
        )
    }
}

export default App
