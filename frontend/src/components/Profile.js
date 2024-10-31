import React, { useEffect, useState } from "react";
import { User, Edit2, Check, X, DollarSign, List, Briefcase, Lock, Settings } from "lucide-react";
import styles from "../assets/styles/profile/profile.module.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProfile, setUserProfile] = useState({
    email: "",
    name: "",
    income: 0,
    expenses: [],
    budgets: [],
    loans: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      try {
        console.log("Fetching user profile...");
        const response = await fetch("/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userProfile.name, income: userProfile.income }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    }
  };

  const renderProfileTab = () => (
    <div className={styles.profileSection}>
      <div className={styles.profileHeader}>
        <ProfileInfo
          userProfile={userProfile}
          isEditing={isEditing}
          setUserProfile={setUserProfile}
          onEditToggle={() => setIsEditing((prev) => !prev)}
          onSave={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
      <UserFinances userProfile={userProfile} />
    </div>
  );

  const ProfileInfo = ({ userProfile, isEditing, setUserProfile, onEditToggle, onSave, onCancel }) => (
    <div className={styles.profileInfo}>
      {isEditing ? (
        <EditForm userProfile={userProfile} setUserProfile={setUserProfile} onSave={onSave} onCancel={onCancel} />
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
        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
        className={styles.editInput}
      />
      <input
        type="number"
        value={userProfile.income}
        onChange={(e) => setUserProfile({ ...userProfile, income: e.target.value })}
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
      <p className={styles.userEmail}>{userProfile.email}</p>
      <button onClick={onEditToggle} className={styles.editButton}>
        <Edit2 size={16} /> Edit Profile
      </button>
      <p className={styles.userIncome}>Income: ${userProfile.income}</p>
    </div>
  );

  const UserFinances = ({ userProfile }) => (
    <div className={styles.financesSection}>
      <h3>Financial Overview</h3>
      <ul>
        <li>
          <DollarSign size={16} /> Income: ${userProfile.income}
        </li>
        <li>
          <List size={16} /> Expenses: {userProfile.expenses.length} items
        </li>
        <li>
          <Briefcase size={16} /> Budgets: {userProfile.budgets.length} items
        </li>
        <li>
          <List size={16} /> Loans: {userProfile.loans.length} items
        </li>
      </ul>
    </div>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.content}>
        {activeTab === "profile" && renderProfileTab()}
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className={styles.sidebar}>
    {["profile", "security", "preferences"].map((tab) => (
      <button
        key={tab}
        className={`${styles.tabButton} ${activeTab === tab ? styles.active : ""}`}
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
