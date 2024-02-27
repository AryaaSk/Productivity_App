import './styles.css'

import { GetState } from './state';
import { FormatDate } from './extra';

import { useState } from 'react';

const data = GetState();


const APP = () => {
  const date = new Date()

  return (    
    <div id='container'>
      <h1>Tasks</h1>

      <h3>{FormatDate(date)}</h3>

      <div className="task">
        bruh
      </div>
    </div>
  );
}

export default APP;
