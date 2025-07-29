import Cookies from "js-cookie";

const useRole = (): number | null => {
  const roleCookie = Cookies.get("role");
  const userRoleCookie = Cookies.get("user");

  let role: number | null = null;

  if (roleCookie) {
    try {
      const parsed = JSON.parse(roleCookie);
      role = parsed.role ?? null;
    } catch (e) {
      console.error("Gagal parsing roleCookie", e);
    }
  }

  if (!role && userRoleCookie) {
    try {
      const parsed = JSON.parse(userRoleCookie);
      role = parsed.role ?? null;
    } catch (e) {
      console.error("Gagal parsing userRoleCookie", e);
    }
  }

  return role;
};

export default useRole;
