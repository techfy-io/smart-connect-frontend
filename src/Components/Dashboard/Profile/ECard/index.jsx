import React, { useState, useEffect } from 'react';
import Cover from './comps/Cover';
import ProfileActions from './comps/ProfileActions';
import placholder from '../../../../Inspect/Men1.png'
import logo from '../../../../Inspect/icons/logo-smartconnect.png'
import './ecard.scss';
import Social from './comps/Social';
import { t } from 'i18next';
import './index.scss'

const ECard = (props) => {
    const { user } = props
    const [showmore, setShowmore] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 365px)');
        setIsMobile(mediaQuery.matches);
        const handleResize = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handleResize);
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    const sliceText = (text, max, showbtn, state, setShowmore) => {
        if (!text) return ''; 
    
        console.log(text, "text");
    
        if (text.length <= max) {
            return text; 
        }
    
        if (showbtn) {
            return (
                <>
                    {state ? text.slice(0, max) : text}{' '}
                    <span style={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => setShowmore(!state)}>
                        {state ? 'read more' : 'show less'}
                    </span>
                </>
            );
        }
    
        // If no show button, just return truncated text with ellipsis
        return text.slice(0, max) + '...';
    };
    

    return (
        <div className="ecard-wrapper">
            <Cover {...props} />
            <div className="profile-wrapper">
                <div className="profile-photo">
                    <img src={user?.profile_picture || placholder} alt="profile" />
                </div>
                <div className="profile-name">
                <div className="name-container">
                    <span className="first-name" dangerouslySetInnerHTML={{ __html: user?.first_name }} />
                    <span className="last-name" dangerouslySetInnerHTML={{ __html: user?.last_name }} />
                </div>
                {user?.job_title && (
                    <span className="job-title" dangerouslySetInnerHTML={{ __html: sliceText(user.job_title, 150) }} />
                )}
                <p>{sliceText(user?.sub_company && user?.sub_company !== "" ? user?.sub_company : user?.company, 150)}</p>
            </div>



                <ProfileActions {...props} />
                <Social {...props} />
                {user?.bio_graphy ? (
                <div>
                    <h5 className="bio-heading">Biographie</h5>
                    <p className="bio-para" dangerouslySetInnerHTML={{ __html: user?.bio_graphy }}></p>
                </div>
                ) : null}


                <div className="logo">
                    <img src={logo} alt="Smart Connect logo" />
                </div>
            </div>
        </div>
    )
}

export default ECard