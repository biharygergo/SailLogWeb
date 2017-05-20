import {Injectable} from "@angular/core";
import {
} from "angularfire2";
import {Observable} from "rxjs";
import {Http, RequestOptions, Headers} from "@angular/http";
import {FirebaseListObservable} from "angularfire2/database/firebase_list_observable";
import {AngularFireDatabase} from "angularfire2/database/database";
import {AngularFireAuth} from "angularfire2/auth/auth";
import {FirebaseObjectObservable} from "angularfire2/database/firebase_object_observable";
import {Training} from "../models/training";
@Injectable()

export class Firebase{

  public users: FirebaseListObservable<any>;

  public coachTeam: FirebaseListObservable<any>;
  public coachId: string;

  private url = 'https://fcm.googleapis.com/fcm/send';
  private authKey = 'AAAAehV5n9U:APA91bEDGrHVgNrMu7mrdioaR2aFO9l-RVxO3_RbCHblVcwEcb4pC3E5AhdDmYMlZ3_sbjG-oTsmMBpP9s04gYkJ8L1uons-ZTwyb8YxGUxsOAGH8DtIsBoGpRkM_d8lEejK_-CF3G3C';

  public loaded = Observable.of(false);

  constructor(public db: AngularFireDatabase,private auth:AngularFireAuth, private http: Http) {
    console.log("Construct")
    this.users = db.list('users');

    auth.authState.subscribe(auth => {
      if(auth === null){
      }
      else{
        this.coachId = auth.uid;
        this.coachTeam = this.db.list('/coaches/'+this.coachId+'/team');
        this.loaded = Observable.of(true);
      }
    })
  }



  login(email: string, password: string){
    return this.auth.auth.signInWithEmailAndPassword(email, password)



  }


  logout() {
    return this.auth.auth.signOut();
  }

  checkLogin() {
    return !!this.auth.authState;
  }
  registerUser(email, password) {
    return this.auth.auth.createUserWithEmailAndPassword(email, password)
  }

  saveNewCoach(values: Object, uid: String) {

    let coach = {
      name: values["name"],
    };

    return this.db.object('/coaches/'+uid).set(coach);

  }

  addSailorToTeam(sailor){
    let newmember = {
      accepted: false
    };
    this.db.object('coaches/'+this.coachId + '/team/' + sailor.$key).set(newmember);
  }

  removeSailorFromTeam(sailor){
    this.db.object('coaches/'+this.coachId + '/team/' + sailor.$key).set(null);

  }

  search(filterText): Observable<any[]>{
    return this.db.list('users')
      .map(_users => _users.filter(user => {
        if(!!user.fullName)
          return user.fullName.includes(filterText)}));
  }

  isInCoachTeam(sailor): FirebaseObjectObservable<any>{
    //console.log(sailor)
   // if(!!sailor)

    return this.db.object('coaches/'+this.coachId+'/team/'+sailor.$key);
    //return false;
  }

  getTrainings(sailorId): FirebaseListObservable<Training[]>{
    return this.db.list('trainings/'+sailorId);
  }
  getTraining(sailorId, trainingId): FirebaseObjectObservable<Training>{
    return this.db.object('trainings/'+sailorId+'/'+trainingId);
  }

  setReview(sailorId, trainingId, review){

    return this.db.object('reviews/' + sailorId + '/' + trainingId).set(review);
  }

  sendTrainingReviewNotification(sailorId, trainingId, callback){
    this.db.object('users/' + sailorId + '/registrationToken').take(1).subscribe(token => {
      if(!!token){

        if(token.$value !== "") {

          this.sendReviewPushNotification(token.$value, trainingId).take(1).subscribe(data => {
            callback("Notification sent!");
          });

        }
        else{
          callback("User not signed in! No notification sent!")
        }
      }
    });
  }

  sendCoachRequest(sailorId,coachId, callback){

    console.log(this.coachId)
    this.db.object('users/' + sailorId + '/registrationToken').take(1).subscribe(token => {
      if(!!token){

        if(token.$value !== "") {

          this.sendCoachRequestNotification(token.$value, coachId).take(1).subscribe(response => {
            callback("Notification sent!");
          })


        }
        else{
          callback("User not signed in! No notification sent!")
        }
      }
    });

  }


  sendCoachRequestNotification(deviceId: string, coachId: string){

    let body =
      {
        "data":{
          "type": "acceptCoach",
          "coachId": coachId
        },
        "to": deviceId,
      };

    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'key='+this.authKey
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url, body, options).map(response => {
      return response;
    })
  }

  sendReviewPushNotification(deviceId: string, trainingId: string) {

    let body =
      {
        "data":{
          "type": "review",
          "title": "Training review",
          "body": "Your coach has reviewed your training. Tap to see review.",
          "trainingId": trainingId
        },
        "to": deviceId,
      };
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'key='+this.authKey
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url, body, options).map(response => {
      return response;
    })
  }
}
