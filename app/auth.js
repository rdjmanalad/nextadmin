import jwt from "jsonwebtoken";

export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwt.decode(token);
    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
      return decodedToken.exp < currentTime;
    }
    return false;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};
