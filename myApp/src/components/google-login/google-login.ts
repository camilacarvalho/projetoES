import { Component } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';


/**
 * Generated class for the GoogleLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {

  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
              private gplus: GooglePlus,
              private platform: Platform) {

    this.user = this.afAuth.authState;

  }

  googleLogin(){
    if(this.platform.is('cordova')){
      this.nativeGoogleLogin();
    } else{
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void>{

    try {

      const gplusUser = await this.gplus.login({
        'webClientId': 'AIzaSyCxIg5B8z2F531HyxDiKSprhF-P4ueDi7Y',//remeber to export this constant later as env variable
        'offline': true,
        'scopes': 'profile email'
      })
      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))

    } catch (err){
      console.log(err)
    }

  }

  async webGoogleLogin(): Promise<void> {
    try{
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);

      return credential;
    } catch(err) {
      console.log(err)
    }
  }

  signOut() {
    
    this.afAuth.auth.signOut();

    if (this.platform.is('cordova')){
      this.gplus.logout();
    }

  }

}
