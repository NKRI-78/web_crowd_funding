import Cookies from "js-cookie";

export function getUser(): AuthDataResponse | null {
  const userCookie = Cookies.get("user");
  if (!userCookie) return null;

  try {
    const user: AuthDataResponse = JSON.parse(userCookie);
    return user;
  } catch (error) {
    console.error("Invalid user cookie", error);
    return null;
  }
}
