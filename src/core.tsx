import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { BrowserRouter } from 'react-router';
import Routing from './routingV1.tsx';
import SessionBootstrap from './auth/SessionBootstrap.tsx';
import { ThemeProvider } from './theme/ThemeProvider.tsx';
import './styles/calendar.css';
import './styles/font.css';
import './styles/global.css';
import './styles/app-v1.css';
import './styles/themes.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ThemeProvider>
       <BrowserRouter>
          <SessionBootstrap />
          <Routing />
       </BrowserRouter>
     </ThemeProvider>
  </StrictMode>,
)
