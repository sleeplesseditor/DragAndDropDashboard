import * as React from 'react';
import { Provider, useDispatch } from 'react-redux';
import getStore,{ type AppDispatch } from "@modules/redux/store";
import { bootstrapApp } from "@modules/app/slice";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const store = getStore();

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(bootstrapApp())
  }, []);

  return <App />
} 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppContent />
    </Provider>
  </StrictMode>,
)
