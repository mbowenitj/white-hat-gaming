import { Component, OnInit } from '@angular/core';
import { HttpDataService } from '../http-data.service';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  games: any = [];
  gamesToDisplay: any = [];

  otherCategoriesToDisplay: any = [];

  jackpots: any = [];
  showme: boolean = false;

  constructor(private data: HttpDataService) { }

  ngOnInit() {
    setInterval(() => this.updateJackpots(), 20000);

    let gamesSub: Subscription = this.data.getGames().subscribe(data => {
      this.games = data;
      this.jackpotsFunction();
      gamesSub.unsubscribe();

    });

    $(function () {
      $('.tabs-nav a').click(function () {

        // Check for active
        $('.tabs-nav li').removeClass('active');
        $(this).parent().addClass('active');

        // Display active tab
        let currentTab = $(this).attr('href');
        $('.tabs-content div').hide();
        $(currentTab).show();

        return false;
      });
      $("#slots").click(function () {
        $(".ribbon").show();
      });
    });
  }

  selectGamesToPlay(category) {
    this.gamesToDisplay = [];
    for (var x in this.games) {
      const found = this.games[x].categories.filter(element => element == category);
      if (found.length > 0) {
        this.gamesToDisplay.push(this.games[x]);
      }
    }
  }

  // group other categories
  otherCategory() {
    this.gamesToDisplay = [];
    for (var x in this.games) {
      const found = this.games[x].categories.filter(element => element == 'ball' || element == 'virtual' || element == 'fun');
      if (found.length > 0) {
        this.gamesToDisplay.push(this.games[x]);
      }
    }
  }

  jackpotsFunction() {
    this.jackpots = [];
    this.gamesToDisplay = [];
    let jactpotSub = this.data.getJackPorts().subscribe(data => {
      this.jackpots = data
      if (this.jackpots.length > 0) {
        this.onJackpot();
      }
      jactpotSub.unsubscribe();

    });
  }

  onJackpot() {
    this.gamesToDisplay = [];
    if (this.jackpots.length > 0) {
      for (var x in this.jackpots) {
        this.gamesToDisplay
        var result = this.games.find(item =>
          Object.keys(item).some(k => item[k] != null &&
            item[k].toString().toLowerCase()
              .includes(this.jackpots[x].game.toLowerCase()))
        );
        if (result) {
          result.amount = this.jackpots[x].amount;
          this.gamesToDisplay.push(result);
        }
      }
    }
  }

  updateJackpots() {
    let jactpotSub: Subscription = this.data.getJackPorts().subscribe(res => {
      if (JSON.stringify(res) !== JSON.stringify(this.jackpots))
        this.jackpots = res;
      console.log("data changed");
      jactpotSub.unsubscribe();

    });

  }
}
