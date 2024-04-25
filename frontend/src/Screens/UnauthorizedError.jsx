import React from "react";

const UnauthorizedError = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>401 Unauthorized</h1>
      <p style={styles.message}>
        Sorry, you are not authorized to access this page.
      </p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "250px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#ff6347", // Or any other color you prefer
  },
  message: {
    fontSize: "1.2rem",
  },
};

export default UnauthorizedError;
