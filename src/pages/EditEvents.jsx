import React from 'react'
import EditEventComp from '../components/EditEventComp';
import Sidebar from '../components/Sidebar';

const EditEvents = () => {
    return (
        <>
            <div class="app-shell">
                {/* side bar  */}
                <Sidebar />
                {/* all events  */}
                <EditEventComp />
            </div>
        </>
    )
}

export default EditEvents
