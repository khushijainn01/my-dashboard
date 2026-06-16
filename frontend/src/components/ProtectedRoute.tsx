import { Navigate } from "react-router-dom";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const sessionExpiry =
    localStorage.getItem("sessionExpiry");

  const isSessionExpired =
    !sessionExpiry ||
    Date.now() > Number(sessionExpiry);

  if (!isLoggedIn || isSessionExpired) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("sessionExpiry");

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}