import { Avatar, Button, Skeleton } from '@mui/material';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { stringAvatar } from '../utils/utilAvatar';
import EditIcon from '@mui/icons-material/Edit';
import bg2 from '../assets/demon-slayer-1.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Context } from '../context/myContext';
import { urlServer } from '../api/apiMyAnimeList';
const ProfileUser = () => {
  const { darkMode } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [loadingResources, setLoadingResources] = useState(true);

  const getUser = async () => {
    try {
      const response = await axios.get(`${urlServer}/token`, {
        withCredentials: true,
      });
      const decodedToken = await jwtDecode(response.data.accessToken);
      console.log(decodedToken);
      setName(decodedToken.name);
      setAvatar(decodedToken.avatar_url);
      setAvatar(decodedToken.avatar_url);
      setDescription(decodedToken.description);
    } catch (err) {
      navigate('/');
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className={`fixed flex justify-center items-center  top-0 right-0 left-0 bottom-0 min-h-screen overflow-auto  z-[800] ${darkMode ? 'bg-black ' : 'bg-white'}`}>
      <div className={`text-white   md:mt-0 rounded-lg my-10 w-[300px] lg:w-[350px] mx-2 overflow-hidden ${darkMode ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
        <div className="header-bg relative h-[200px] flex  justify-center bg-cover" style={{ backgroundImage: `url(${bg2})` }}>
          {/* loading */}
          {loadingResources ? (
            <div className="absolute top-[80%]  picture shadow-2xl mb-5 ">
              <Skeleton variant="circular" sx={{ bgcolor: '#6b7280' }} width={80} height={80} />
            </div>
          ) : avatar ? (
            // jika ia punya avatar dari db
            <div className="absolute top-[80%]  picture shadow-2xl mb-5 ">
              <Avatar sx={{ width: 80, height: 80 }} alt={name} src={avatar} />
            </div>
          ) : (
            // jika tidak punya avatar
            <div className="absolute top-[70%]  picture mb-5 ">
              <Avatar {...stringAvatar(name, 'large')} />
            </div>
          )}
        </div>

        <div className="pt-10 text-center mb-10 px-3">
          {loadingResources ? (
            <div className="w-2/6 mx-auto">
              <Skeleton variant="text" sx={{ bgcolor: '#6b7280' }} />
            </div>
          ) : (
            <h1 className={`text-xl mb-1 font-semibold  ${darkMode ? 'text-white' : 'text-black'}`}>{name}</h1>
          )}
          {loadingResources ? (
            <>
              <Skeleton variant="text" sx={{ bgcolor: '#6b7280' }} />
              <div className="w-4/6 mx-auto">
                <Skeleton variant="text" sx={{ bgcolor: '#6b7280' }} />
              </div>
            </>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-black'}`}>{description}</p>
          )}
          <div className={`flex border-t-2 pt-2   justify-between items-center mt-10 gap-4 ${darkMode ? 'border-zinc-700' : 'border-zinc-400'}`}>
            <section className="w-32 translate-y-1 -translate-x-4">
              <Button
                color="error"
                size="small"
                endIcon={<ArrowBackIcon />}
                onClick={() => {
                  navigate(location.state ? location.state.dest : '/');
                }}
              >
                Back
              </Button>
            </section>
            <div className={`${darkMode ? 'text-white' : 'text-black'}`}>
              <button className="flex gap-2 mx-auto  justify-center hover:border-[var(--primary)]" onClick={() => navigate('edit')}>
                <p className="text-sm">edit profile</p>
                <EditIcon sx={{ color: darkMode ? 'text-white' : 'text-black', fontSize: 20 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
