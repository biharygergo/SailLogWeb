import {CanActivate} from "@angular/router";
import {Injectable} from "@angular/core";
import {Firebase} from "../providers/firebase";
/**
 * Created by Gergo on 2017. 05. 19..
 */
@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private firebase: Firebase) {}

  canActivate() {
    return this.firebase.checkLogin();
  }
}
