import repositories from "../repositories";

class AuthService {
  constructor(tokenKey = 'token', userKey = 'user') {
    this.tokenKey = tokenKey;
    this.userKey = userKey;
    this.authRepository = repositories.AuthRepository;
  }

  get authToken() {
    return localStorage.getItem(this.tokenKey);
  }

  set authToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  get authUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  set authUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  
  async login(email, password) {
    return await this.authRepository.login(email, password);
  }
  
  async register(name, email, password) {
    return await this.authRepository.register(name, email, password);
  }
  
  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
  logout() {
    this.clearAuthData();
  }
}

export default new AuthService();
