import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import EditProfile from "./EditProfile";
import { getUserProfile, followUser, unfollowUser } from "../services/userService";
import "./Profile.css";
import Cookies from "js-cookie";
import { getCurrentUser } from "../services/authService";

function Profile({ match, user: currentUser }) {
    const [user, setUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const userEmail = Cookies.get('userEmail');

    useEffect(() => {
        async function fetchUserProfile() {
            let connectedUser = await getCurrentUser(userEmail);
            setUser(connectedUser);
            console.log(connectedUser);
        }
        fetchUserProfile();
    }, [match.params.userId, currentUser]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <Avatar className="profile-avatar" alt={user.name} src="/path-to-avatar-image.jpg" />
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email"><strong>Email:</strong> {user.email}</p>
            <p className="profile-username"><strong>Username:</strong> {user.username}</p>
            <p className="profile-cin"><strong>CIN Number:</strong> {user.cinNumber}</p>
            <p className="profile-role"><strong>Role:</strong> {user.role}</p>
            {/* Add follow/unfollow button, edit profile button, etc. */}
        </div>
    );
}

export default Profile;
