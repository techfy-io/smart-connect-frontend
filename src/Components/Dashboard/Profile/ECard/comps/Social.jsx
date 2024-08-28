import React from 'react';
import facebook from '../../../../../Inspect/icons/facebook.svg';
import instagram from '../../../../../Inspect/icons/instagram.svg';
import linkedin from '../../../../../Inspect/icons/linkedin.svg';
import glob from '../../../../../Inspect/icons/glob.svg';

const Social = ({ user }) => {
    const links = [
        { link: user?.facebook_url || '#', alt: 'facebook link', icon: facebook },
        { link: user?.instagram_url || '#', alt: 'instagram link', icon: instagram },
        { link: user?.linkedin_url || '#', alt: 'linkedin link', icon: linkedin },
        { link: user?.other_link_1 || '#', alt: 'web link', icon: glob },
    ]
    return (
        <div className="social-wrapper">
            {links.map(({ link, alt, icon }, i) => (
                <a key={i} href={link} target={link == '#' ? '_self' : '_blank'} rel="noopener noreferrer">
                    <img width={24} height={24} src={icon} alt={alt} />
                </a>
            ))}
        </div>
    )
}

export default Social
