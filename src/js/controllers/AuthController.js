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
}

export default new AuthController();