import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './auth/Login';
import AllEvents from './pages/AllEvents';
import CreateEvent from './pages/CreateEvent';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import EditEvents from './pages/EditEvents';
import DriveBackup from './pages/DriveBackup';
import DriveEventDetail from './pages/DriveEventDetail';



const Router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
      loader: PublicRoute

    },
    {
        path: '/all-events',
        element: <AllEvents />,
        loader: ProtectedRoute 
    },
    {
        path: '/create-events',
        element: <CreateEvent />,
        loader: ProtectedRoute
    },
    {
        path: '/admin/event/edit/:id',
        element: <EditEvents />,
        loader: ProtectedRoute
    },
    {
        path: '/drive-backup',
        element: <DriveBackup />,
        loader: ProtectedRoute
    },
    {
        path: '/drive-backup/:eventId',
        element: <DriveEventDetail />,
        loader: ProtectedRoute
    }
   
])
export default Router;
