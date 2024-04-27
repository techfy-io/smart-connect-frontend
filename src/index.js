import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

const root = createRoot(document.getElementById('root'));

i18n.init({
  lng: 'en',
  debug: true,
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
        "Email": "Email",
        "Submit": "Submit",
        "Reset Password": "Reset Password",
        "New Password": "New Password",
        "Confirm Password": "Confirm Password",
        "Save": "Save",
        "Please input your new password": "Please input your new password",
        "Please confirm your password": "Please confirm your password",
        "The new password and confirm password do not match!": "The new password and confirm password do not match!",
        "Invalid or expired token": "Invalid or expired token",
        "Please check your email for the latest reset link or request a new one.": "Please check your email for the latest reset link or request a new one.",
        "Company Name": "Company Name",
        "Action": "Action",
        "No Company found": "No Company found",
        "No users found": "No users found",
        "View": "View",
        "Delete": "Delete",
        "Edit": "Edit",
        "User Name": "User Name",
        "Role": "Role",
        "View Profile": "View Profile",
        "Purchase New Card": "Purchase New Card",
        "Add Company": "Add Company",
        "French": "French",
        "English": "English",
      }
    },
    fr: {
      translation: {
        "Welcome": "Bienvenue",
        "Sign in to continue": "Connectez-vous pour continuer",
        "Forgot Password": "Mot de passe oublié",
        "Password": "mot de passe",
        "Enter your email or username": "Entrez votre email ou votre nom d'utilisateur",
        "Login": "Se connecter",
        "Please enter your email and password": "Veuillez entrer votre email et votre mot de passe",
        "Enter the email address you used when joining, and we’ll send reset instructions to reset your password.": "Entrez l'adresse e-mail que vous avez utilisée lors de votre inscription et nous vous enverrons des instructions de réinitialisation pour réinitialiser votre mot de passe.",
        "Email": "E-mail",
        "Submit": "Soumettre",
        "Reset Password": "réinitialiser le mot de passe",
        "New Password": "nouveau mot de passe",
        "Confirm Password": "Confirmez le mot de passe",
        "Save": "Sauvegarder",
        "Please input your new password": "Veuillez saisir votre nouveau mot de passe",
        "Please confirm your password": "Veuillez confirmer votre mot de passe",
        "The new password and confirm password do not match!": "Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas !",
        "Invalid or expired token": "Jeton invalide ou expiré",
        "Please check your email for the latest reset link or request a new one.": "Veuillez vérifier votre courrier électronique pour connaître le dernier lien de réinitialisation ou en demander un nouveau.",
        "Company Name": "Nom de l'entreprise",
        "Action": "Action",
        "No Company found": "Aucune entreprise trouvée",
        "No users found": "Aucun utilisateur trouvé",
        "View": "Vue",
        "Delete": "Supprimer",
        "Edit": "Modifier",
        "User Name": "Nom d'utilisateur",
        "Role": "Rôle",
        "View Profile": "Voir le profil",
        "Purchase New Card": "Acheter une nouvelle carte",
        "Add Company": "Ajouter une entreprise",
        "French": "Français",
        "English": "Anglais",
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
