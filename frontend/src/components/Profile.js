import React, { useEffect, useState } from "react";
import { User, Edit2, Check, X, DollarSign, List, Briefcase, LogOut } from "lucide-react";
import styles from "../assets/styles/profile/profile.module.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState({
        email: "",
        name: "",
        income: 0,
        expenses: [],
        budgets: [],
        loans: []
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
            try {
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("/api/user/profile", {
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

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={styles.content}>
                {activeTab === "profile" && renderProfileTab()}
                <button
                    onClick={handleLogout}
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#FF6347",
                        color: "#fff",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    <LogOut size={20} style={{ marginRight: "8px" }} /> Logout
                </button>
            </div>
        </div>
    );
};

const ProfileInfo = ({ userProfile, isEditing, setUserProfile, onEditToggle, onSave, onCancel }) => (
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
            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
            className={styles.editInput}
            placeholder="Name"
        />
        <input
            type="number"
            value={userProfile.income}
            onChange={(e) => setUserProfile({ ...userProfile, income: parseFloat(e.target.value) || 0 })}
            className={styles.editInput}
            placeholder="Income"
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
    </div>
);

const UserFinances = ({ userProfile }) => (
    <div className={styles.userMeta}>
        <div className={styles.metaItem}>
            <DollarSign size={20} />
            <div>
                <h3>Income</h3>
                <p>₹{userProfile.income.toLocaleString()}</p>
            </div>
        </div>
        <div className={styles.metaItem}>
            <List size={20} />
            <div>
                <h3>Expenses</h3>
                <p>6 items</p>
            </div>
        </div>
        <div className={styles.metaItem}>
            <Briefcase size={20} />
            <div>
                <h3>Budgets</h3>
                <p>8 items</p>
            </div>
        </div>
        <div className={styles.metaItem}>
            <List size={20} />
            <div>
                <h3>Loans</h3>
                <p>4 items</p>
            </div>
        </div>
    </div>
);

const Sidebar = ({ activeTab, setActiveTab }) => (
    <div className={styles.sidebar}>
        <button
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
        >
            <User size={20} /> Profile
        </button>
    </div>
);

export default ProfilePage;
