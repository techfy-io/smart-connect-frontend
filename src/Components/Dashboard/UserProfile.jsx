import React from 'react';
import './UserProfile.scss'; // Importing SCSS file for styling
import Men from "../../Inspect/Men.png";
import Men1 from "../../Inspect/Men1.png";
const UserProfileCard = ({ user }) => {
  return (
    <div className="user-profile-card">
      <div className="card">
        <div className="cover-photo" style={{ backgroundImage: `url(${Men1})` }}></div>
        <img src={Men} className="avatar" />
        <div className="user-details">
          <h2>zahid</h2>
          <p>Zahid2</p>
          <div className="contact-info">
            <p>Email: asdasdas</p>
            <p>Phone:dadasdasdasdasd</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
