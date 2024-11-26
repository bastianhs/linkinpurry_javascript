import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faCalendar, 
  faClock, 
  faPen, 
  faEye, 
  faEyeSlash 
} from "@fortawesome/free-solid-svg-icons";
import api from "../../api";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userid = await api.get('http://localhost:4001/api/profile/me');
        const id = userid.data.body.userId;
        // console.log('http://localhost:4001/api/profile/'+id);
        // const response = await fetch('http://localhost:4001/api/profile/'+id);
        const response = await api.get('http://localhost:4001/api/profile/'+id);
        const data = response.data.body;
        console.log(data);
        setUserData({
          username: data.username,
          email: data.email,
          created_at: data.created_at,
          updated_at: data.updated_at,
        }); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  if (showEditForm) {
    return <EditProfileForm onCancel={() => setShowEditForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Profile Information</h2>
            {userData ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <ProfileItem
                      icon={faUser}
                      label="Username"
                      value={userData.username}
                    />
                    <ProfileItem
                      icon={faEnvelope}
                      label="Email"
                      value={userData.email}
                    />
                    <ProfileItem
                      icon={faCalendar}
                      label="Member Since"
                      value={new Date(userData.created_at).toLocaleDateString()}
                    />
                    <ProfileItem
                      icon={faClock}
                      label="Last Updated"
                      value={new Date(userData.updated_at).toLocaleDateString()}
                    />
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPen} className="h-5 w-5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <LoadingSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <FontAwesomeIcon icon={icon} className="h-5 w-5 text-gray-500" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="text-center py-8">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </div>
  </div>
);

const EditProfileForm = ({ onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-2 text-sm text-gray-600">Update your personal information</p>
          </div>

          <div className="space-y-6">
            <TextInput id="email" label="Email" type="email" placeholder="Enter your email" />
            <TextInput id="username" label="Username" type="text" placeholder="Enter your username" />
            <PasswordInput
              id="password"
              label="New Password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const TextInput = ({ id, label, type, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder={placeholder}
    />
  </div>
);

const PasswordInput = ({ id, label, showPassword, setShowPassword }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={id}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Enter new password"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  </div>
);

export default UserProfile;
