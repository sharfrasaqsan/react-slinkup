const authErrorMessages = {
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/wrong-password": "The password you entered is incorrect.",
  "auth/user-not-found": "No account found with this email address.",
  "auth/email-already-in-use": "This email is already in use.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/missing-password": "Password is required.",
  "auth/network-request-failed": "Network error. Please try again.",
  "auth/internal-error": "Internal error occurred. Try again later.",
};

export const getAuthErrorMessage = (code) =>
  authErrorMessages[code] || "Something went wrong. Please try again.";
