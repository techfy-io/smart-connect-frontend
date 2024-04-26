import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

const root = createRoot(document.getElementById('root'));

i18n.init({
  lng: 'en',
  debug: true, // Corrected typo here
  resources: {
    en: {
      translation: {
        "Welcome": "Welcome",
        "Sign in to continue":"Sign in to continue",
        "Forgot password?":"Forgot password?",
        "Password":"Password",
        "Enter your email or username":"Enter your email or username",
        "Login":"Login",
      }
    },
    fr: { // Changed 'frnch' to 'fr'
      translation: {
        "Welcome": "Bienvenue",
        "Sign in to continue":"Connectez-vous pour continuer",
        "Forgot password?":"Mot de passe oublié?",
        "Password":"mot de passe",
        "Enter your email or username":"Entrez votre email ou votre nom d'utilisateur",
        "Login":"Se connecter",
      }
    }
  }
});

root.render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </I18nextProvider>
);
