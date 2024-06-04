import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import EditProfile from "./EditProfile";
import { getUserProfile, followUser, unfollowUser } from "../services/userService";
import "./Profile.css";

function Profile({ match, user: currentUser }) {
    const [user, setUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                if (!currentUser || !currentUser.email) {
                    setError("User not found.");
                    return;
                }
                
                const email = match.params.email || currentUser.email;
                const { data } = await getUserProfile(email);
                setUser(data);

                if (currentUser && data.followers.includes(currentUser._id)) {
                    setIsFollowing(true);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Error fetching user profile.');
            }
        }
        fetchUserProfile();
    }, [match.params.email, currentUser]);

    const handleFollow = async () => {
        try {
            await followUser(user.email);
            setIsFollowing(true);
            setUser((prevUser) => ({
                ...prevUser,
                followers: [...prevUser.followers, currentUser._id],
            }));
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await unfollowUser(user.email);
            setIsFollowing(false);
            setUser((prevUser) => ({
                ...prevUser,
                followers: prevUser.followers.filter((id) => id !== currentUser._id),
            }));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>User profile not available at the moment. Please try again later.</div>;
    }

    return (
        <>
            {isEditing ? (
                <EditProfile user={user} onClose={() => setIsEditing(false)} />
            ) : (
                <div className="profile_main_container">
                    <div className="profile_wrapper">
                        <div className="profile_picture">
                            <Avatar
                                style={{ width: "9rem", height: "22vh" }}
                                className="suggestion_user_avatar"
                                alt="Profile Picture"
                                src={user.profile_picture}
                            />
                        </div>
                        <div className="profile_details">
                            <div className="user_name_edit_wrapper">
                                <div className="user_name">{user.username}</div>
                                {currentUser._id === user._id ? (
                                    <div className="edit_btn_div">
                                        <button className="edit_btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                                    </div>
                                ) : (
                                    <div className="follow_btn_div">
                                        {isFollowing ? (
                                            <button className="unfollow_btn" onClick={handleUnfollow}>Unfollow</button>
                                        ) : (
                                            <button className="follow_btn" onClick={handleFollow}>Follow</button>
                                        )}
                                    </div>
                                )}
                                <div className="setting_btn">
                                    <svg
                                        aria-label="Options"
                                        className="_8-yf5"
                                        color="#262626"
                                        fill="#262626"
                                        height="24"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            fill="none"
                                            r="8.635"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        ></circle>
                                        <path
                                            d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796l.505-1.002 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="post_follower_wrapper">
                                <div className="posts">
                                    <strong>{user.posts.length}</strong> posts
                                </div>
                                <div className="followers">
                                    <strong>{user.followers.length}</strong> followers
                                </div>
                                <div className="following">
                                    <strong>{user.following.length}</strong> following
                                </div>
                            </div>
                            <div className="bio_wrapper">
                                <div className="profile_name">
                                    <strong>{user.full_name}</strong>
                                </div>
                                <div>{user.bio}</div>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            )}
        </>
    );
}

export default Profile;
