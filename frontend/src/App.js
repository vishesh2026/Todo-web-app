import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TaskContext from './context/TaskContext';
import TokenContext from './context/TokenContext';
import BoardContext from './context/BoardContext';
import taskReducer from './reducer/taskReducer';
import boardReducer from './reducer/boardReducer';
import tokenReducer from './reducer/tokenReducer';
import userReducer from './reducer/userReducer';

import Header from './components/Header/Header';
import Login from './components/Login';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import ResetPassword from './components/forgotPassword/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import axios from './Axios/axios.js';

function App() {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [tasks, taskDispatch] = useReducer(taskReducer, []);
  const [boards, boardDispatch] = useReducer(boardReducer, []);
  const [userToken, tokenDispatch] = useReducer(tokenReducer, token);
  const [user, userDispatch] = useReducer(userReducer, {});
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/getuser", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        userDispatch({ type: "SET_USER", payload: res.data.user });
      } catch (error) {
        console.error("Fetch user error:", error);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          tokenDispatch({ type: "UNSET_TOKEN" });
        }
      } finally {
        setLoading(false);
      }
    };

    if (userToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [userToken]);

  // Fetch boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await axios.get("/board", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        boardDispatch({ type: "SET_BOARDS", payload: res.data });
      } catch (error) {
        console.error("Fetch boards error:", error);
      }
    };

    if (userToken) {
      fetchBoards();
    }
  }, [userToken]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/task", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        taskDispatch({ type: "SET_TASKS", payload: res.data });
      } catch (error) {
        console.error("Fetch tasks error:", error);
      }
    };

    if (userToken) {
      fetchTasks();
    }
  }, [userToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <TokenContext.Provider value={{ userToken, tokenDispatch, user, userDispatch }}>
        <BoardContext.Provider value={{ boards, boardDispatch }}>
          <TaskContext.Provider value={{ tasks, taskDispatch }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/" element={<Header />}>
                <Route index element={userToken ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={!userToken ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!userToken ? <Register /> : <Navigate to="/" />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Route>
            </Routes>
          </TaskContext.Provider>
        </BoardContext.Provider>
      </TokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;