/**
 * Created by Gergo on 2017. 05. 20..
 */
export class Training{
  city: string;
  country : string;
  date : string;
  details : string;
  downwindspeed : number;
  duration : number;
  fileLocation : string;
  id : number;
  overallspeedrating : number;
  pointingrating : number;
  sails : Sail[];
  upwindspeed : number;
  waveDetails : WaveDetails;
  windDetails: WindDetails;
  boatDetails: BoatDetails;
  waveType : string;
  windSpeed : number;
  winddir : string;
  button: number;
}
export class WindDetails{
  average : number;
  maximumGust : number;
  minimumLull : number;
  portMean : number;
  starboardMean : number;
  windDirection : number;
}
export class BoatDetails{
  bend : number;
  choks : number;
  notes : string;
  rake : number;
  tension : number;
}
export class WaveDetails{
  currentdirection : number;
  currentspeed : number;
  wavedirection : number;
  waveheight : number;
}
export class Sail{
  function : string;
  health : number;
  id : number;
  lightHours : number;
  mediumHours : number;
  name : string;
  racingHours : number;
  strongHours : number;
  totalHours : number;
  trainingHours : number;
}
