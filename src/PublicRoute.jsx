import { useState } from 'react';
import { redirect } from 'react-router-dom';



const PublicRoute = async () => {
    const token = localStorage.getItem('moToken');
    if (!token) {
        return null;
    }
    else {
        throw redirect('/all-events');
    }
}

export default PublicRoute;
