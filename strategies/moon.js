// Let's create our own strategy
var strat = {};
// For calculate angle between points
var angleBetweenPoints = require('angle-between-points');


var lastCandle = null;
var firstRun = true;


// Prepare everything our strat needs
strat.init = function() {

  // add a native indicator
  // this.addIndicator('name', 'type', parameters);

  // add a TA-lib indicator
  // this.addTalibIndicator('name', 'type', parameters);

  // add a Tulip indicator
  // this.addTulipIndicator('name', 'type', parameters);

  this.addTulipIndicator('ema7', 'ema', { optInTimePeriod: 7}); //

  this.addTalibIndicator('dema10', 'dema', { optInTimePeriod: 10}); //
  this.addTalibIndicator('tema10', 'tema', { optInTimePeriod: 10}); //

  this.addTulipIndicator('ema30', 'ema', { optInTimePeriod: 30}); // ROOT TREND


  let candleProps = this.asyncIndicatorRunner.candleProps
}

// What happens on every new candle?
strat.update = function(candle) {
  // your code!
}

// For debugging purposes.
strat.log = function() {
  // your code!
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {

  console.log('-------------------------- ', this.candle.start, ' --------------------------');

  console.log('EMA7 - ', this.tulipIndicators.ema7.result.result)
  console.log('DEMA10 - ', this.talibIndicators.dema10.result.outReal)
  console.log('TEMA10 - ', this.talibIndicators.tema10.result.outReal)
  console.log('EMA30 - ', this.tulipIndicators.ema30.result.result)

  console.log(this.candle);

  var ema7 = this.tulipIndicators.ema7.result.result;
  var dema10 = this.talibIndicators.dema10.result.result;
  var tema10 = this.talibIndicators.tema10.result.result;
  var ema30 = this.tulipIndicators.ema30.result.result;

  if(firstRun){
    firstRun = false;
  } else {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    console.log(lastCandle);
    console.log(this.candle);
    console.log('lastCandle CLOSE: ', lastCandle.close);
    console.log('actualCandle CLOSE: ', this.candle.close);
    console.log('lastCandle START: ', lastCandle.start);
    console.log('actualCandle START: ', this.candle.start);
    console.log('timeBetweenPoints: ', secondsBetweenPointsAsMoment(lastCandle.start, this.candle.start));
    console.log('percent between point: ', relDiff(lastCandle.close, this.candle.close));
    console.log('calculateAngleCandle: : ', calculateAngleCandle(lastCandle, this.candle));
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
  }


  // ERSTER BUY
  // Wenn Tief erreicht und x prozent unter EMA30
  // - Wenn also vorher fallen und nun steigend -> zwischenspeichern
  // - Wenn ab Tief über letzte 5 kerze steigend und tief max 5 kerzen her und jetzt stark steigend (dema10 und EMA10) dann BUY


  // ERSTER SELL
  // Wenn vorhergies tief wieder erreich (einfach erstmal)
  // Oder wenn kurs von EMA10 oder DEMA10 nicht mehr steigend (erstmal einfach)

  lastCandle = this.candle;
}

/** ****************************************************************************
 *                   Zusatzfunktionen !!!
 * ****************************************************************************/

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
  // your code!
}

module.exports = strat;


/**
 *
 * @param emaA
 * @param emaB
 * @returns {*}
 */
function calculateAngleEMA(emaA, emaB) {
  return angleBetweenPoints( {x: 1, y: 1}, {x: 4, y: 4} );
}

/**
 *
 * @returns {null}
 */
function overOrUnderEMA(emaA, emaB) {

  return null;
}


function calculateAngleCandle(candleA, candleB) {

  // why not in percent ?

  var dividerMinute = 60;
  var dividerHour = 60 * 60;
  var dividerDay = 60 * 60 * 24;

  var xBMultiplier = 0.01;
  //var xB = secondsBetweenPointsAsMoment(candleA.start, candleB.start) / dividerHour;
  var xB = 60;
  var yB = relDiff(candleA.close, candleB.close) * 100; // Care at this point !!!!
  /**
   * ------ xB ------- mit dividerHour skalierbar
   * xB ist sehr wichtig da hier risiko sehr stark vergrößert oder verringert werden kann
   * Je kleiner xB ist desto extremer wird der auf oder absteigende winkel
   * xB könnte somit gut in abhängigkeit von strategien oder der Candle Time gesetz werden, bzw. muss dies auch !!!
   *
   */
  return courseUpOrDown(candleA, candleB) * angleBetweenPoints( {x: 0, y: 0}, {x: xB, y: yB} );
}

function relDiff(a, b) {
  return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
}
// example
relDiff(11240, 11192); //=> 0.42796005706134094


/**
 * @param startA as a moment
 * @param startB as a moment
 * @returns timedifference in seconds, for example 3600 seconds is a day
 */
function secondsBetweenPointsAsMoment(startA, startB) {
  return startB.diff(startA) // 86400000
}

function courseUpOrDown(candleA, candleB) {
  if(candleA.close < candleB.close){
    return 1;
  }
  return -1;
}

function getActualTrend(data, ){
  const createTrend = require('trendline');

  const data = [
    { y: 2, x: 1 },
    { y: 4, x: 2 },
    { y: 5, x: 3 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

// Takes the following arguments (dataset, xKey, yKey)
  const trend = createTrend(data, 'x', 'y');

  console.log(trend);
// { slope: 0.6, yStart: 2.2, calcY: [Function: calcY] }
}


/**
 * Konzentrier dich auf Ereignisse DROP unter EMA25
 * - Ab wieviel Prozent eregnisse in welcher Zeit ?
 *
 *
 */


/**
 * ToDo's
 *
 * ToDo(1):
 * Methode welche den letzten höchsten Punkt einer EMA kurve ermittel
 * Methode welche den letzten niedrigsten Punkt einer EMA Kurve ermittelt
 * Methide welche die Zirkulation einer EMA Kurve ermittelt (Winkel)
 *      - Größer werdend
 *      - Kleiner werdend
 * Methode welche Abstand zwischen zwei EMA Kurven ermittelt
 * Methode welche zwischen zwei EMA kruven ermittelt, welche der beiden höher ist
 * Methode welche ermittelt wie weit entfernt zwei EMA kruven sind
 * Methode welche den winkel einer EMA Kurve zum Zeitpunkt / Candle x ermittelt
 * Methode welche nach einer bestimten Zeit SHORT geht
 * Methode zur % berechnung zwischen zwei Candles ausgehend von erster Candle -> Profit / Loss
 * Methode zur Kalkulierung der Korrekten EMA Werte welche adaptiv zu Kursschwankungen und somit % Profiten reagiert
 *      - Schwankungen unter 1 % z.B. kosten zu nah a feed
 *      - Schwankungen größer, so trade möglich rentabler da weiter von feed weg
 * Methode welche verschiedene beliebige Strategien ermöglicht und diese JUST wechseln kann
 * Methode welche vordefinierte Ereignisse ermittelt (Harter Drop)
 *
 *
 * ToDo(2) - Plan wie anfangen ?
 *  - Wenn Steigung EMA >= x dann LONG
 *  - Wenn Steigung EMA <= y dann SHORT
 *
 * ToDo(3)
 *    - Prozentualer unterschied zur vorherigen Candle
 *    - Alle unterschiede zur vorherigen Candle
 *    - Ausgabe Candle Time 1, 3, 15, 60m or 1d 2d etc.
 *
 *
 *
 * Verhältnis winkel zu Zeit (aktuelle candle zu letzter candle)
 *
 *
 * var angleBetweenPoints = require('angle-between-points');

 angleBetweenPoints( {x: 1, y: 1}, {x: 4, y: 4} );
 // returns 45

 angleBetweenPoints( {x: 2, y: 2}, {x: -4, y: -4} );
 // returns 225

 angleBetweenPoints( {x: 2, y: 0}, {x: -4, y: 0} );
 // returns 180
 *
 *
 *
 * Struct erstellen zu jeder EMA den Winkel und Upper or Under erstellen
 *
 *
 *
 * npm trendline https://www.npmjs.com/package/trendline
 */
