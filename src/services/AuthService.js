import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

class AuthService {
  login(email, password) {
    const payload = {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    };

    return axios.post(`${BASE_URL}/auth/login`, payload).then((res) => {
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        
        window.dispatchEvent(new Event("auth_changed"));
      }
      return res.data;
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth_changed"));

    window.location.href = "/login";
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAdmin() {
    return this.getCurrentUser()?.rol === "ADMIN";
  }

  isVendedor() {
    return this.getCurrentUser()?.rol === "VENDEDOR";
  }

  isCliente() {
    return this.getCurrentUser()?.rol === "CLIENTE";
  }
}

export default new AuthService();
