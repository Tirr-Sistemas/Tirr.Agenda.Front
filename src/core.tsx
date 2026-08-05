/**
 * Ponto de composição e inicialização da aplicação React.
 *
 * Configura os casos de uso, autenticação, renovação de sessão, providers e
 * roteamento antes de montar a árvore no elemento `#root`.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { BrowserRouter } from 'react-router';
import Routing from '@/presentation/app/Routing';
import SessionBootstrap from '@/presentation/app/SessionBootstrap';
import { ThemeProvider } from '@/presentation/providers/ThemeProvider';
import { createApplication } from '@/core/createApplication';
import { ApplicationProvider } from '@/presentation/providers/ApplicationProvider';
import { ConfirmProvider } from '@/presentation/providers/ConfirmProvider';
import { ErrorBoundary } from '@/presentation/app/ErrorBoundary';
import { configureAuthentication, useAuthStore } from '@/presentation/stores/authStore';
import { setApiRefreshHandler } from '@/shared-architecture/http/ApiHttpClient';
import '@/presentation/styles/calendar.css';
import '@/presentation/styles/font.css';
import '@/presentation/styles/global.css';
import '@/presentation/styles/app-v1.css';
import '@/presentation/styles/themes.css';
import '@/presentation/styles/foundations.css';
import '@/presentation/styles/modern.css';


const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Não foi possível iniciar a aplicação porque o elemento #root não existe.');
const application = createApplication();
configureAuthentication(application.authentication);
setApiRefreshHandler(() => useAuthStore.getState().refreshSession());

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ApplicationProvider application={application}>
        <ThemeProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <SessionBootstrap />
              <Routing />
            </BrowserRouter>
          </ConfirmProvider>
        </ThemeProvider>
      </ApplicationProvider>
    </ErrorBoundary>
  </StrictMode>,
)
