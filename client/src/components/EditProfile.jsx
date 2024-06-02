import React, { useState } from 'react';
import { updateUserProfile } from '../services/userService';
import './Profile.css';

function EditProfile({ user, onClose }) {
    const [formData, setFormData] = useState({
        username: user.username,
        full_name: user.full_name,
        bio: user.bio,
        profile_picture: user.profile_picture
    });

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="edit-profile-modal">
            <form className="edit-profile-form" onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label>Profile Picture</label>
                    <input
                        type="text"
                        name="profile_picture"
                        value={formData.profile_picture}
                        onChange={handleChange}
                    />
                </div>
                <div className="edit-btn-group">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
