import React, { useEffect, useState } from "react";
import {
  Camera,
  Lock,
  User,
  Edit2,
  Check,
  X,
  Briefcase,
  MapPin,
  Globe,
  Calendar,
  Settings,
} from "lucide-react";
import styles from "../assets/styles/profile/profile.module.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    location: "",
    website: "",
    joinDate: "",
    bio: "",
    image: "", // Assuming userProfile.image is included
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile"); // Replace with your API endpoint
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderProfileTab = () => (
    <div className={styles.profileSection}>
      <div className={styles.profileHeader}>
        <ProfileImage
          imagePreview={imagePreview}
          userImage={userProfile.image}
          onImageChange={handleImageChange}
        />
        <ProfileInfo
          userProfile={userProfile}
          isEditing={isEditing}
          setUserProfile={setUserProfile}
          onEditToggle={() => setIsEditing((prev) => !prev)}
          onSave={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
      <BioSection
        bio={userProfile.bio}
        isEditing={isEditing}
        setUserProfile={setUserProfile}
      />
    </div>
  );

  const ProfileImage = ({ imagePreview, userImage, onImageChange }) => (
    <div className={styles.profileImageContainer}>
      <img
        src={imagePreview || userImage || "/api/placeholder/150/150"}
        alt="Profile"
        className={styles.profileImage}
      />
      <label className={styles.imageUpload}>
        <Camera className={styles.cameraIcon} />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className={styles.fileInput}
        />
      </label>
    </div>
  );

  const ProfileInfo = ({
    userProfile,
    isEditing,
    setUserProfile,
    onEditToggle,
    onSave,
    onCancel,
  }) => (
    <div className={styles.profileInfo}>
      {isEditing ? (
        <EditForm
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <DisplayInfo userProfile={userProfile} onEditToggle={onEditToggle} />
      )}
    </div>
  );

  const EditForm = ({ userProfile, setUserProfile, onSave, onCancel }) => (
    <div className={styles.editForm}>
      <input
        type="text"
        value={userProfile.name}
        onChange={(e) =>
          setUserProfile({ ...userProfile, name: e.target.value })
        }
        className={styles.editInput}
      />
      <div className={styles.editActions}>
        <button onClick={onSave} className={styles.saveButton}>
          <Check size={20} /> Save
        </button>
        <button onClick={onCancel} className={styles.cancelButton}>
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  );

  const DisplayInfo = ({ userProfile, onEditToggle }) => (
    <div className={styles.displayInfo}>
      <h1 className={styles.userName}>{userProfile.name}</h1>
      <button onClick={onEditToggle} className={styles.editButton}>
        <Edit2 size={16} /> Edit Profile
      </button>
      <UserMeta userProfile={userProfile} />
    </div>
  );

  const UserMeta = ({ userProfile }) => (
    <div className={styles.userMeta}>
      <MetaItem icon={Briefcase} label={userProfile.occupation} />
      <MetaItem icon={MapPin} label={userProfile.location} />
      <MetaItem icon={Globe} label={userProfile.website} />
      <MetaItem icon={Calendar} label={`Joined ${userProfile.joinDate}`} />
    </div>
  );

  const MetaItem = ({ icon: Icon, label }) => (
    <div className={styles.metaItem}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );

  const BioSection = ({ bio, isEditing, setUserProfile }) => (
    <div className={styles.bioSection}>
      <h3>About Me</h3>
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) =>
            setUserProfile((prev) => ({ ...prev, bio: e.target.value }))
          }
          className={styles.bioEdit}
        />
      ) : (
        <p>{bio}</p>
      )}
    </div>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.content}>
        {activeTab === "profile" && renderProfileTab()}
        {/* Add security and preferences tabs here */}
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className={styles.sidebar}>
    {["profile", "security", "preferences"].map((tab) => (
      <button
        key={tab}
        className={`${styles.tabButton} ${
          activeTab === tab ? styles.active : ""
        }`}
        onClick={() => setActiveTab(tab)}
      >
        {getTabIcon(tab)} {capitalize(tab)}
      </button>
    ))}
  </div>
);

const getTabIcon = (tab) => {
  switch (tab) {
    case "profile":
      return <User size={20} />;
    case "security":
      return <Lock size={20} />;
    case "preferences":
      return <Settings size={20} />;
    default:
      return null;
  }
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default ProfilePage;
