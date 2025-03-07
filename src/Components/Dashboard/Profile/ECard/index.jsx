import React, { useState, useEffect } from "react";
import Cover from "./comps/Cover";
import ProfileActions from "./comps/ProfileActions";
import placholder from "../../../../Inspect/Men1.png";
import logo from "../../../../Inspect/icons/logo-smartconnect.png";
import { Card } from "antd";
import "./ecard.scss";
import Social from "./comps/Social";
import { t } from "i18next";
import { Button } from "antd";
// e card
const ECard = (props) => {
  const { user } = props;
  const [showmore, setShowmore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 365px)");
    setIsMobile(mediaQuery.matches);
    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const sliceText = (text, max, showbtn, state, setShowmore) => {
    if (!text) return "";

    if (text.length <= max) {
      return text;
    }

    if (showbtn) {
      return (
        <>
          {state ? text.slice(0, max) + "..." : text}{" "}
          <span
            style={{ whiteSpace: "nowrap", cursor: "pointer" }}
            onClick={() => setShowmore(!state)}
          >
            {state ? "voir plus" : "voir moins"}
          </span>
        </>
      );
    }

    return text.slice(0, max) + "...";
  };
  console.log(user, "user data");
  return (
    <div className="ecard-wrapper">
      <Cover {...props} />
      <div className="profile-wrapper">
        <div className="profile-photo">
          <img src={user?.profile_picture || placholder} alt="profile" />
        </div>
        <div className="profile-name">
          <h3>
            {sliceText(
              `${user?.first_name} ${user?.last_name || ""}`,
              100,
              false
            )}
          </h3>
          {user?.job_title && (
            <small>{sliceText(user?.job_title, 150, false)}</small>
          )}
          <p>
            {sliceText(
              user?.sub_company && user?.sub_company !== ""
                ? user?.sub_company
                : user?.company,
              150,
              false
            )}
          </p>
        </div>
        <ProfileActions {...props} />
        <Social {...props} />
        {(user?.other_link_2 || user?.other_link_3 || user?.other_link_4) && (
          <div
            style={{
              display: "flex",
              justifyContent: user?.other_link_4
                ? "space-between"
                : user?.other_link_3
                ? "center"
                : "center",
              gap: "10px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            {[
              { url: user?.other_link_2, label: user?.other_link_media_2 },
              { url: user?.other_link_3, label: user?.other_link_media_3 },
              { url: user?.other_link_4, label: user?.other_link_media_4 },
            ]
              .filter((link) => link.url) // Remove empty links
              .map((link, index, array) => (
                <a
                  key={index}
                  target="_blank"
                  href={link.url}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "15px",
                    borderRadius: "20px",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textDecoration: "none",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "14px",
                    minHeight: "50px",
                    width: array.length === 1 ? "100%" : "auto", // Center if only one link
                    textAlign: "center",
                  }}
                >
                  {link.label}
                </a>
              ))}
          </div>
        )}

        {user?.bio_graphy && (
          <div className="about-wrapper">
            <h5>{t("Biography")}</h5>
            <p>
              {sliceText(
                user?.bio_graphy,
                isMobile ? 70 : 90,
                true,
                showmore,
                setShowmore
              )}
            </p>
          </div>
        )}
        <div className="logo">
          <img src={logo} alt="Smart Connect logo" />
        </div>
        {/* <p>
                    {user?.other_link_media_2} :
                    <a target='blank' href={user?.other_link_2}>{user?.other_link_2}</a>
                </p> */}
      </div>
    </div>
  );
};

export default ECard;
