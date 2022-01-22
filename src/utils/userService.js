import {BehaviorSubject} from 'rxjs';

const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('PMA::USER')));

export const userService = {
  user : userSubject.asObservable(),
  get userValue () {
    return userSubject.value;
  }
};
