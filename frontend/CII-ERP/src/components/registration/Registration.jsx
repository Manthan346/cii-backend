import { useFormik } from "formik";
import "./Registration.css";
import { Link } from "react-router-dom";

export default function Registration() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      center: "",
      role: "",
      password: "",
    },

    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Registration</h2>

        {/* First Name & Last Name */}
        <div className="name-row">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={formik.handleChange}
            value={formik.values.firstName}
          />

          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={formik.handleChange}
            value={formik.values.lastName}
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={formik.handleChange}
          value={formik.values.email}
        />

        <input
          name="mobile"
          type="number"
          placeholder="Mobile Number"
          onChange={formik.handleChange}
          value={formik.values.mobile}
        />

        <input
          name="center"
          type="text"
          placeholder="Center"
          onChange={formik.handleChange}
          value={formik.values.center}
        />

        {/* Role Dropdown */}
        <select
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
        >
          <option value="">Select Role</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="Student">Student</option>
          <option value="Accountant">Accountant</option>
          <option value="Hostel Warden">Hostel Warden</option>
        </select>

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />

        <button type="submit">Submit</button>

        <p className="login-page">
          Already have an account?{" "}
          <Link to="/LoginPage">Login</Link>
        </p>
      </form>
    </div>
  );
}