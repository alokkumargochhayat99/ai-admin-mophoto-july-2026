import React from 'react';
import '../components/Dashboard.css';
import Sidebar from '../components/Sidebar';
import AllEvnetComp from '../components/AllEvnetComp';



const AllEvents = () => {
    return (
        <>
            <div class="app-shell">
                {/* side bar  */}
                <Sidebar />
                {/* all events  */}
                <AllEvnetComp />
            </div>
        </>
    )
}

export default AllEvents
