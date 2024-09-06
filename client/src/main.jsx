import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css'

import Contact from './contact/contact.jsx'
import ContactLists from './contact-lists/contact-lists.jsx'

const router = createBrowserRouter([
  {
    // Main page
    path: '/',
    element: <Contact></Contact>
  },
  {
    // Selected Contact page
    path: '/:name',
    element: <Contact></Contact>
  },
  {
    // Contact List page
    path: '/lists',
    element: <ContactLists></ContactLists>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)
