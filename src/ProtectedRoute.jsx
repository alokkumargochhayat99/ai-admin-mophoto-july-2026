import { redirect } from 'react-router-dom';


const ProtectedRoute = async ({ request }) => {

    const token = localStorage.getItem('moToken');

    if (!token) {
        throw redirect('/');
    }

}

export default ProtectedRoute;