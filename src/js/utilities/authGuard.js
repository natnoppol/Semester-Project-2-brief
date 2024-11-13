import services from '../services/index';
import utils from './utils';

export async function authGuard() {
  const token = services.AuthService.authToken;
  console.log(token)

  if (token){
    alert('You must be logged in to view this page');
    utils.redirectTo('/auth/login/');
  }
}

