import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter } from 'react-router';
import Routing from './routing.tsx';
import './styles/calendar.css';
import './styles/font.css';
import './styles/global.css';
import './styles/tokens.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
        <Routing />
     </BrowserRouter>
  </StrictMode>,
)
