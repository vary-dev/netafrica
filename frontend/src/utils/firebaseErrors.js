export function getFirebaseErrorMessage(
  error
) {
  const messages = {
    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/missing-password":
      "Please enter your password.",

    "auth/weak-password":
      "Your password is too weak.",

    "auth/email-already-in-use":
      "An account already exists with this email.",

    "auth/invalid-credential":
      "The email or password is incorrect.",

    "auth/user-disabled":
      "This account has been disabled.",

    "auth/network-request-failed":
      "We could not connect. Check your internet connection.",

    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",

    "auth/popup-blocked":
      "Your browser blocked the Google sign-in window.",

    "auth/too-many-requests":
      "Too many attempts. Please wait before trying again.",

    "auth/requires-recent-login":
      "Please confirm your identity again before continuing.",
  };

  return (
    messages[error?.code] ||
    "Something went wrong. Please try again."
  );
}