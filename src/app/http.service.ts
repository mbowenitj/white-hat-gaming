import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  gamesURL = "http://stage.whgstage.com/front-end-test/games.php";

  jackportsURL = "http://stage.whgstage.com/front-end-test/jackpots.php";

  getGames() {
    return this.http.get(this.gamesURL);
  }

  getJackPorts() {
    return this.http.get(this.jackportsURL);
  }

}
