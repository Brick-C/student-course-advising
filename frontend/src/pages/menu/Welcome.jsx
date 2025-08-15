import "../../styles/welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-content">
      <h2>Course Advising System</h2>

      <div className="user">
        <p>Welcome User</p>
        <p>2022-3-45-7777</p>
        <p>user123@gmail.com</p>
      </div>

      <p>
        Welcome to your course advising dashboard. Use the menu on the left to
        navigate.
      </p>
    </div>
  );
};

export default Welcome;
