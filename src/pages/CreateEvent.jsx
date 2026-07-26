import React from 'react'
import CreateEventComp from '../components/CreateEventComp'
import './CreateEvent.css';
import Sidebar from '../components/Sidebar';

const CreateEvent = () => {
    return (
        <>
            <div class="app-shell">
                {/* side bar  */}
                <Sidebar />
                {/* all events  */}
                <CreateEventComp />
            </div>
        </>
    )
}

export default CreateEvent
