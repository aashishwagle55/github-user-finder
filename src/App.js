import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

import GithubState from './context/github/GithubState';
import axios from 'axios';

import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // search GitHub users
  const searchUsers = async (text) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    setUsers(res.data.items);
    setLoading(false);
  };

  // get single GitHub User
  const getUser = async (login) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${login}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    setUser(res.data);
    setLoading(false);
  };

  // get user's repos
  const getUserRepos = async (login) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${login}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    setRepos(res.data);
    setLoading(false);
  };

  // clear users from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  // alert if search text is empty
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 1500);
  };

  return (
    <GithubState>
      <Router>
        <div className='App'>
          <Navbar title='Github Finder' icon='fab fa-github' />
          <div className='container'>
            <Alert alert={alert} />
            <Routes>
              <Route
                path='/'
                element={
                  <Fragment>
                    <Search
                      searchUsers={searchUsers}
                      clearUsers={clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={showAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                }
              />
              <Route path='/about' element={<About />} />
              <Route
                path='/user/:login'
                element={
                  <User
                    getUser={getUser}
                    getUserRepos={getUserRepos}
                    user={user}
                    repos={repos}
                    loading={loading}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
