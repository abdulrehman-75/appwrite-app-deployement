import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './store/store.js';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'; // ✅ correct import
import { Protected, Login } from './components';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import AllPost from './pages/AllPost.jsx';
import EditPost from './pages/EditPost.jsx';
import AddPost from './pages/AddPost.jsx';
import Post from './pages/Post.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: '/signup',
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: '/all-posts',
        element: (
          <Protected authentication>
            <AllPost />
          </Protected>
        ),
      },
      {
        path: '/add-post',
        element: (
          <Protected authentication>
            <AddPost />
          </Protected>
        ),
      },
      {
        path: '/edit-post/:slug',
        element: (
          <Protected authentication>
            <EditPost />
          </Protected>
        ),
      },
      {
        path: '/post/:slug',
        element: <Post />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
