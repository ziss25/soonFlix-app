import { Avatar, Card, CardHeader, CircularProgress, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import Footer from '../components/Templates/Footer';
import { Context } from '../context/myContext';
import { stringAvatar } from '../utils/utilAvatar';
import { urlServer } from '../api/apiMyAnimeList';

const UserList = () => {
  const { statusLogin, setStatusLogin, darkMode } = useContext(Context);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [userLogin, setUserLogin] = useState(true);
  const [data, setData] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${urlServer}/token`, {
        withCredentials: true,
      });
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      setToken(response.data.accessToken);
      setUserLogin(true);
    } catch (err) {
      setUserLogin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const axiosJwt = axios.create();

  axiosJwt.interceptors.request.use(
    async (config) => {
      setIsLoading(true);
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`${urlServer}/token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      setIsLoading(false);
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const auth = async () => {
    try {
      const response = await axiosJwt.get(`${urlServer}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setStatusLogin(true);
    } catch (err) {
      console.error('Error:', err);
    } finally {
    }
  };

  useEffect(() => {
    refreshToken();
    auth();
  }, [token, statusLogin]);

  return (
    <>
      <div className="min-h-screen pt-14">
        {isloading ? (
          <div className="flex fixed  justify-center items-center min-h-screen top-0 right-0 left-0 bottom-0">
            <CircularProgress />
          </div>
        ) : (
          <div className="max-w-xl px-5 pt-5 mx-auto flex flex-col">
            {userLogin ? (
              data.map((user) => (
                <Card
                  className={`mb-5 ${name === user.name ? 'order-first' : null} `}
                  sx={{
                    backgroundColor: darkMode ? '#18181b' : '#e4e4e7',
                    color: darkMode ? 'white' : 'black',
                  }}
                >
                  <CardHeader
                    avatar={
                      user.avatar_url ? (
                        <Avatar
                          sx={{ bgcolor: 'red' }}
                          aria-label="recipe" //
                          src={user.avatar_url}
                        ></Avatar>
                      ) : (
                        <Avatar {...stringAvatar(user.name, 'medium')} />
                      )
                    }
                    action={<IconButton aria-label="settings"></IconButton>}
                    title={
                      name == user.name ? (
                        <div className="flex gap-2">
                          <h1>{user.name}</h1>
                          <span className="px-2 text-xs scale-75 bg-[var(--primary)] rounded-lg text-white">you</span>
                        </div>
                      ) : (
                        user.name
                      )
                    }
                    subheader={
                      <Typography
                        sx={{
                          color: darkMode ? '#aeaeae' : '#475569',
                          fontSize: 12,
                        }}
                      >
                        {/* optimaze jika description   memiliki char panjang */}
                        {user.description?.length > 60
                          ? user.description.slice(0, 55 - 3) + '...' //
                          : user.description}{' '}
                      </Typography>
                    }
                  />
                </Card>
              ))
            ) : (
              <div className="flex h-[80vh] items-center justify-center">
                <h1 className="text-center text-2xl">silahkan login dlu bray</h1>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserList;
