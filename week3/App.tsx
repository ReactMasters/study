import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import PropsChild from './components/Children/PropsChild';
import Home from './components/Home/Home';
import Parent from './components/Parent/Parent';
import Post from './components/Post/Post';

function App() {
  return (
    <div>
       <Parent><PropsChild></PropsChild></Parent>
    </div>
  );
}

export default App;
