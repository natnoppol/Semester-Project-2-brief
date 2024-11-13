import services from '../services/index';

class AuthController {
    constructor(){
        this.authService = services.AuthService
    }

    async login({email, password}){
        try {
            const { token, user } = await this.authService.login(email, password);
            return { token, user }; // Return token and user to LoginController
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
    }

    async register({ name, email, password }) {
        try {
          const response = await this.authService.register(name, email, password);

          return { name, email };

        } catch (error) {
          console.error('Register error:', error);
          throw new Error('Register Failed. Please check you data input.');
        }
      }
}

export default new AuthController();