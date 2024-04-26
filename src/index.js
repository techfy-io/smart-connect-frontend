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
        "Sign in to continue": "Sign in to continue",
        "Forgot Password": "Forgot password",
        "Password": "Password",
        "Enter your email or username": "Enter your email or username",
        "Login": "Login",
        "Please enter your email and password": "Please enter your email and password",
        "Enter the email address you used when joining, and we’ll send reset instructions to reset your password.": "Enter the email address you used when joining, and we’ll send reset instructions to reset your password.",
        "Email":"Email",
        "Submit":"Submit",
      }
    },
    fr: { // Changed 'frnch' to 'fr'
      translation: {
        "Welcome": "Bienvenue",
        "Sign in to continue": "Connectez-vous pour continuer",
        "Forgot Password": "Mot de passe oublié",
        "Password": "mot de passe",
        "Enter your email or username": "Entrez votre email ou votre nom d'utilisateur",
        "Login": "Se connecter",
        "Please enter your email and password": "Veuillez entrer votre email et votre mot de passe",
        "Enter the email address you used when joining, and we’ll send reset instructions to reset your password.": "Entrez l'adresse e-mail que vous avez utilisée lors de votre inscription et nous vous enverrons des instructions de réinitialisation pour réinitialiser votre mot de passe.",
      "Email":"E-mail",
      "Submit":"Soumettre",
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
