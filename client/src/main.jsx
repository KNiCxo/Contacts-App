import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css';

import Contact from './contact/contact.jsx';
import ContactLists from './contact-lists/contact-lists.jsx';
import Error from './Error/error.jsx';

const router = createBrowserRouter([
  {
    // Main page
    path: '/',
    element: <Contact></Contact>
  },
  {
    // Selected Contact page
    path: '/:listName',
    element: <Contact></Contact>
  },
  {
    // Contact List page
    path: '/lists',
    element: <ContactLists></ContactLists>
  },
  {
    // Error page
    path: '/error',
    element: <Error></Error>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)
