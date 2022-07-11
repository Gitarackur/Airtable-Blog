import React from 'react';
// import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Home from './components/Home';
import PostView from './components/Post/View';
import CreatePost from './components/Post/Create';
import UpdatePost from './components/Post/Update';

function App() {
  return (
    <div className="App px-3 md:px-10 lg:px-0">
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id/view" element={<PostView />} />
        <Route path="/posts/:id/edit" element={<UpdatePost/>} />
        <Route path="/signup" element={<div></div>} />
        <Route path="/create" element={<CreatePost/>} />
        {/* <Route element={<div />} status={404} /> */}
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
