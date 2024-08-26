import React from 'react';
import Cover from './comps/Cover';
import ProfileActions from './comps/ProfileActions';
import placholder from '../../../../Inspect/Men1.png'
import './ecard.scss';

const ECard = (props) => {
    const { user } = props

    const sliceText = (text, max) => {
        if (text.length <= max) {
            return text
        }
        return text.slice(0, max) + '...'
    }

    return (
        <div className="ecard-wrapper">
            <Cover {...props} />
            <div className="profile-wrapper">
                <div className="profile-photo">
                    <img src={user?.profile_picture || placholder} alt="profile" />
                </div>
                <div className="profile-name">
                    <h3>{sliceText(`${user?.first_name} ${user?.last_name || ''}`, 100)}</h3>
                    {user?.job_title && (<small>({sliceText(user?.job_title, 150)})</small>)}
                    <p>{sliceText(user?.company, 150)}</p>
                </div>
                <ProfileActions {...props} />
            </div>
        </div>
    )
}

export default ECard