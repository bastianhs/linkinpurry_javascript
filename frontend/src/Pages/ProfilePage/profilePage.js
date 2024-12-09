import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faCalendar, 
  faClock, 
  faPen, 
  faEye, 
  faEyeSlash,
  faUsers,
  faBriefcase,
  faTools,
  faCamera,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../Utils/api";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    isPending: false
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userId = id;
        if (!userId) {
          const meResponse = await api.get('http://localhost:4001/api/profile/me');
          userId = meResponse.data.body.userId;
          setIsOwnProfile(true);
          navigate(`/profile/${userId}`, { replace: true });
        } else {
          const meResponse = await api.get('http://localhost:4001/api/profile/me');
          userId = meResponse.data.body.userId;
          setIsOwnProfile(userId === id);
        }
        const response = await api.get(`http://localhost:4001/api/profile/${id}`);
        const data = response.data.body; 
        console.log(data);
        setUserData({
          userId: id,
          username: data.username,
          email: data.email,
          created_at: data.created_at,
          updated_at: data.updated_at,
          full_name: data.full_name,
          profile_photo: data.profile_photo,
          work_history: data.work_history,
          skills: data.skills,
          connection_count: data.connection_count
        }); 

        if (!isOwnProfile) {
          try {
            const connectionResponse = await api.get(`http://localhost:4001/api/connections/status/${id}`);
            setConnectionStatus({
              isConnected: connectionResponse.data.isConnected,
              isPending: connectionResponse.data.isPending
            });
            console.log(connectionResponse.data);
          } catch (connectionError) {
            console.error('Error checking connection status:', connectionError);
          }
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
    // console.log(userData.profile_photo);
  }, [id, isOwnProfile, navigate]);
  const handleConnectionRequest = async () => {
    try {
      await api.post('http://localhost:4001/api/connection-requests', {
        toId: id
      });
      
      setConnectionStatus(prev => ({
        ...prev,
        isPending: true
      }));
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };
  // console.log(userData.profile_photo);
  const EditProfileForm = ({ onCancel }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(userData.profile_photo || null);
    const fileInputRef = useRef(null);
  
    const [formData, setFormData] = useState({
      full_name: userData?.full_name || '',
      email: userData?.email || '',
      username: userData?.username || '',
      password: '',  // typically leave blank for security
      work_history: userData?.work_history || '',
      skills: userData?.skills || '',
      profile_photo: null
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => {
        const newData = {
          ...prevData,
          [name]: value
        };
        console.log(`Updated ${name}:`, value);
        console.log('Full form data:', newData);
        return newData;
      });
    };
  
  

    const handlePhotoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhoto(reader.result);
          setFormData(prev => ({
            ...prev,
            profile_photo: file
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemovePhoto = () => {
      setProfilePhoto(null);
      setFormData(prev => ({
        ...prev,
        profile_photo: null
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Create a new FormData object
      const submitData = new FormData();
      
      // Only append non-empty fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'profile_photo') {
          submitData.append(key, formData[key]);
        }
      });
    
      // Append profile photo if present
      if (formData.profile_photo) {
        submitData.append('profile_photo', formData.profile_photo);
      }
  
      // Extensive logging
      console.log('Final formData:', formData);
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }
      
      try {
        const meResponse = await api.get('http://localhost:4001/api/profile/me');
        const currentUserId = meResponse.data.body.userId;
        
        const response = await api.put(`http://localhost:4001/api/profile/${currentUserId}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Profile updated successfully', response.data);
        onCancel();
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    };
    if (loading) {
      return <LoadingSkeleton />;
    }

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="mt-2 text-sm text-gray-600">Update your personal information</p>
            </div>
  
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {userData.profile_photo ? (
                    <img 
                      src={userData.profile_photo} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-gray-500" />
                    </div>
                  )}
                  
                  {/* Photo Upload Buttons */}
                  <div className="absolute bottom-0 right-0 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
                      title="Upload Photo"
                    >
                      <FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
                    </button>
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
                        title="Remove Photo"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-sm text-gray-600">Click camera icon to upload new photo</p>
              </div>
  
              {/* Personal Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Personal Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput 
                    id="full_name" 
                    label="Full Name" 
                    type="text" 
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                  <TextInput 
                    id="username" 
                    label="Username" 
                    type="text" 
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <TextInput 
                    id="email" 
                    label="Email" 
                    type="email" 
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <PasswordInput
                    id="password"
                    label="New Password"
                    showPassword={showPassword}
                    name="password"
                    setShowPassword={setShowPassword}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
  
              {/* Professional Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Professional Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="work_history" className="block text-sm font-medium text-gray-700 mb-2">
                      Work History
                    </label>
                    <textarea
                      id="work_history"
                      name="work_history"
                      rows="4"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Describe your work experience"
                      value={formData.work_history}
                      onChange={handleInputChange}
                    />
                  </div>
  
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      rows="4"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="List your skills (comma-separated)"
                      value={formData.skills}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
  
              {/* Action Buttons */}
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

  if (showEditForm) {
    return <EditProfileForm onCancel={() => setShowEditForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Profile Information</h2>
            {userData ? (
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  {/* Profile Photo */}
                  <div className="w-1/3">
                    {userData.profile_photo ? (
                      <img 
                        src={userData.profile_photo} 
                        alt="Profile" 
                        className="w-full rounded-lg shadow-md object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
                        <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="w-2/3 space-y-4">
                    <ProfileItem
                      icon={faUser}
                      label="Full Name"
                      value={userData.full_name}
                    />
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
                    <ProfileItem
                      icon={faUsers}
                      label="Connections"
                      value={userData.connection_count}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 border-b pb-2">Professional Details</h3>
                  <div className="space-y-4">
                    <ProfileItem
                      icon={faBriefcase}
                      label="Work History"
                      value={userData.work_history || "No work history added"}
                    />
                    <ProfileItem
                      icon={faTools}
                      label="Skills"
                      value={userData.skills || "No skills listed"}
                    />
                  </div>
                </div>
                {isOwnProfile ? (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPen} className="h-5 w-5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 flex justify-center space-x-4">
                    {connectionStatus.isConnected ? (
                      <div className="text-green-600 font-semibold flex items-center space-x-2">
                        <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                        <span>Connected</span>
                      </div>
                    ) : connectionStatus.isPending ? (
                      <div className="text-yellow-600 font-semibold flex items-center space-x-2">
                        <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                        <span>Connection Pending</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectionRequest}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                )}
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



const TextInput = ({ id, label, type, placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder={placeholder}
    />
  </div>
);

const PasswordInput = ({ id, label, showPassword, setShowPassword, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
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
