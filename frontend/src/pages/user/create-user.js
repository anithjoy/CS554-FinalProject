import { useState, useEffect } from "react";
import { api } from "../../api";
import { ROLE } from "../../helper/constants";
import { helper } from "../../helper";
import { useRouter } from "next/router";
// import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [fullName, setName] = useState("");
  const [Role, setRole] = useState("");
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    if (e.target.id === "signUpEmail") setEmail(e.target.value);
    else if (e.target.id === "signUpRole") setRole(e.target.value);
    else if (e.target.id === "signUpName") setName(e.target.value);
  };

  const validateCreateUserData = async (e) => {
    e.preventDefault();
    try {
      setEmail(helper.validationFunctions.isValidEmail(email));
      setRole(helper.validationFunctions.isValidRole(Role));
      setName(helper.validationFunctions.isValidName(fullName));
      setHasError(false);
    } catch (e) {
      setHasError(true);
      setError(e.message);
      return;
    }

    try {
      const data = { email: email, role: Role, name: fullName };
      const response = await api.user.createUser(data);
      alert("User created");
      router.push("/user");
      setHasError(false);
    } catch (e) {
      setHasError(true);
      if (!e.response) setError("Error");
      else setError(e.response.data);
      return;
    }
  };
  return (
    <div>
      <div className="loginHeading">Create User</div>
      <div className="CreateUserCard card p-4 shadow-sm">
        <form onSubmit={validateCreateUserData}>
          <div className="form-group">
            <label htmlFor="signUpEmail" className="form-label">
              Enter Name
            </label>
            <input
              placeholder="Elon Musk"
              id="signUpName"
              value={fullName}
              onChange={handleInputChange}
              type="text"
              className="loginInput form-control"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="signUpEmail" className="form-label">
              Enter Email
            </label>
            <input
              placeholder="username@example.com"
              id="signUpEmail"
              value={email}
              onChange={handleInputChange}
              type="email"
              className="loginInput form-control"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="signUpRole" className="form-label">
              Choose a Role
            </label>
            <select
              id="signUpRole"
              value={Role}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">--Choose a Role--</option>
              {ROLE.map((spec, index) => {
                return (
                  <option value={spec} key={index}>
                    {spec}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit" className="loginButton btn btn-primary">
            Register User
          </button>
        </form>
        {hasError && (
          <div className="error alert alert-danger mt-3">{error}</div>
        )}
      </div>
    </div>
  );
};

export default CreateUser;
