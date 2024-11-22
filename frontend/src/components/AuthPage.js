import React from "react";

const AuthPage = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Login</h2>
      <button
        onClick={() =>
          (window.location.href =
            "http://localhost:8000/accounts/google/login/")
        }
      >
        Login with Google
      </button>
      <button
        onClick={() =>
          (window.location.href =
            "http://localhost:8000/accounts/facebook/login/")
        }
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default AuthPage;
