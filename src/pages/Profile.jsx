// E:\fitness-tracker\src\pages\Profile.jsx
import { useAppContext } from '../context/AppProvider';
import InputCard from '../components/InputCard';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="ft-profile-container">
      <h2 className="ft-profile-title">User Profile</h2>
      <div className="ft-profile-form">
        <InputCard label="Name" name="name" value={user.name} onChange={handleChange} />
        <InputCard label="Age" name="age" value={user.age} onChange={handleChange} type="number" />
        <InputCard label="Height (cm)" name="height" value={user.height} onChange={handleChange} type="number" />
        <InputCard label="Weight (kg)" name="weight" value={user.weight} onChange={handleChange} type="number" />
      </div>
    </div>
  );
}