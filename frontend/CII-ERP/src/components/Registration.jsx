import { useFormik } from "formik";
import './Registration.css';

export default function Registration() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      center: "",
      password: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
    return (
  <div className="form-container">
    <form onSubmit={formik.handleSubmit}>
      <h2>Registration Form</h2>

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

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />

      <button type="submit">Submit</button>
      <p className="login-page">Already have an account? <a href="/">Login</a></p>
    </form>
  </div>
);
  
}
