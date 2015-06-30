/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
function initialize(){

	//Varibalen zur Feststellung des Fallens
	var falling = false;
	var hit = false;
	var i = 0;
	
	//Variablen zur Berechnung der Falldauer
	var start_time = 0;
	var stop_time = 0;
	var time = 0;
	
	//Variablen zur Berechnung der Strecke
	var height = 0;
	var start = true;
	// Fall abgeschlossen bzw nicht abgeschlossen
	var run = true;
	//Smartphone landet mit dem Display nach unten
	var displayDown = false;
	
	//Variablen zur Feststellung der Rotation
	var alpha;
	var beta;
	var gamma;
	var half_spin = false;
	var quarter_spin = false;
	var three_quarter_spin = false;
	var spins_count = 0;
	var half_spin_counted = false;
	var spinning = false;
	
	// Setzen der Startwerte zur Anzeige
	document.getElementById("time").innerHTML = time;
	document.getElementById("height").innerHTML = height;
	document.getElementById("points").innerHTML = "Punkte: " + 0;
	document.getElementById("highscore").innerHTML = getHighscore();
	document.getElementById("valid").innerHTML = getTry("valid");
	document.getElementById("invalid").innerHTML = getTry("invalid");

	// Button zum zurecksetzen der Werte nach Fall
	var button = document.getElementById("reset");
	button.addEventListener("click", onButtonClicked);

		
	// Blinkende Anzeige
	function setSignReady(ready) {
		var parentElement = document.getElementById('deviceready');
		var showSmashed = parentElement.querySelector('.event.smashed');
		var showDropBread = parentElement.querySelector('.event.ready');
		// Bereit zu fallen
		if(ready){
			showSmashed.setAttribute('style', 'display:none;');
			showDropBread.setAttribute('style', 'display:block;');
		}
		// Werte zurücksetzen
		else{
			showSmashed.setAttribute('style', 'display:block;');
			showDropBread.setAttribute('style', 'display:none;');
		}
	}
	
	// Getter für Anzahl gültiger und ungültiger Versuche 
 	function getTry(tryType){
		if(localStorage.getItem(tryType) == undefined){
			localStorage.setItem(tryType,0);
		}
		if(typeof(Storage) != "undefined") {
			return localStorage.getItem(tryType);
		}
	}
	
	// Setter für gültige und ungültige Versuche
	function setTry(tryType){
		if(localStorage.getItem(tryType) == undefined){
			localStorage.setItem(tryType,0);
		}
		if(typeof(Storage) != "undefined") {
			var val = localStorage.getItem(tryType);
			val++;
			localStorage.setItem(tryType, val);
		}
	}
	// Getter für Highscore
	function getHighscore(){
		if(localStorage.getItem("highscore") == undefined){
			localStorage.setItem("highscore",0);
		}
		if(typeof(Storage) != "undefined") {
			return localStorage.getItem("highscore");
		}
	}
	
	// Setter für Highscore
	function setHighscore(highscore){
		if(localStorage.getItem("highscore") == undefined){
			localStorage.setItem("highscore",0);
		}
		if(typeof(Storage) != "undefined") {
			var val = localStorage.getItem("highscore");
			localStorage.setItem("highscore", highscore);
		}
	}
	
	// Eventlistener zum zurücksetzen der Werte nach Klick auf Button reset
	function onButtonClicked(){
		//Zurücksetzen der Variablen
		run = true;
		start = true;
		spinning = false;
		falling = false;
		hit = false;
		i=0;
		setSignReady(true);
		start_time = 0;
		stop_time = 0;
		time = 0;
		height = 0;
		
		spins_count = 0;
		half_spin = false;
		quarter_spin = false;
		three_quarter_spin = false;
		half_spin_counted = false;
		
		//Zurücksetzen der Anzeige und des Hintergrundbildes
		document.getElementById("time").innerHTML = time;
		document.getElementById("height").innerHTML = height;
		if (window.matchMedia("(orientation: portrait)").matches) {
				document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
		}else{
				document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
		}
		document.getElementById("points").innerHTML = "Punkte: " + 0;
		document.getElementById("rotations").innerHTML = spins_count;
	}

				
		
	if (window.DeviceMotionEvent != undefined) {
		//Bei Orientierungsänderung (Gyroskop)
		window.ondeviceorientation = function(event) {
			alpha = Math.round(event.alpha);
			beta = Math.round(event.beta);
			gamma = Math.round(event.gamma);
		}
	
		// Bei Bewegung des Smartphones (Accelerometer)
		window.ondevicemotion = function(e) {
			if(run){			
				/* Ausgabe zum debuggen */
				//document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
				//document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
				//document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;
				//document.getElementById("rotationAlpha").innerHTML = alpha;
				//document.getElementById("rotationBeta").innerHTML = beta;
				//document.getElementById("rotationGamma").innerHTML = gamma;
				document.getElementById("rotations").innerHTML = spins_count;
				document.getElementById("valid").innerHTML = getTry("valid");
				document.getElementById("invalid").innerHTML = getTry("invalid");
				
				var aaa = Math.round(Math.sqrt(Math.pow(e.accelerationIncludingGravity.x, 2)
									+Math.pow(e.accelerationIncludingGravity.y, 2)
									+Math.pow(e.accelerationIncludingGravity.z, 2)));
				
				//Prüfen auf freien Fall
				if(start && aaa <= 1){
					//Festellung der Zeit zur Fallzeit berechnung
					var date = new Date();
					start_time = date.getTime();
					start = false;
					document.getElementById("points").innerHTML = "GO!";
				}
				
				//Prüfen auf Viertelumdrehung
				if(gamma < 0){
					quarter_spin = true;
				}
				//Prüfen auf halbe Umdrehung
				if(quarter_spin && gamma > 45){
					half_spin = true;
					if(start){
						//Festellung der Zeit zur Fallzeit berechnung
						var date = new Date();
						start_time = date.getTime();
						start = false;
						document.getElementById("points").innerHTML = "GO!";
					}
					spinning = true;
				}
				//Prüfen auf Dreiviertelumdrehung
				if(half_spin && gamma < 0){
					three_quarter_spin = true;
					//Hochzählen des Umdrehungs-Zählers (+0,5)
					if(!half_spin_counted){
						spins_count += 0.5;
						half_spin_counted = true;
					}
				}
				//Prüfen auf vollständige Umdrehung
				if(quarter_spin && half_spin && three_quarter_spin && gamma > 0){
					half_spin = false;
					quarter_spin = false;
					three_quarter_spin = false;
					half_spin_counted = false;
					//Hochzählen des Umdrehungs-Zählers (+0,5)
					spins_count += 0.5;
				}
				
				// Erneute Feststellung des Falls
				if(aaa <= 1) {
					falling = true;
				}
				// Feststellung des Aufpralls
				if(aaa > 15 && i == 0){
					hit=true;
					//Festellung der Zeit zur Fallzeitberechnung
					var date = new Date();
					stop_time = date.getTime();
				}
				
				//Prüfen, ob sich das Gerät noch bewegt
				if(falling && hit && Math.round(aaa) != 0){
					i++;
				}
				
				//Feststellung des Stillstands
				if (falling && hit && i > 20) {
					//Festellung welche Seite oben/ unten liegt
					if(e.accelerationIncludingGravity.z < 0){
						displayDown = true;
					}else{
						displayDown = false;
					}					
					//Gültiger Versuch:
					time = stop_time - start_time;
					height = (9.81 * ((time/1000) * (time/1000))) * 0.75;
					if(!displayDown){
						//Setze Werte zur Anzeige				
						document.getElementById("time").innerHTML = time;
						document.getElementById("rotations").innerHTML = spins_count;
						document.getElementById("height").innerHTML = Math.round(height * 100) / 100;
						var score = Math.round((spins_count / height) * 100) / 100;
						document.getElementById("points").innerHTML = "Punkte: " + score;
						if(getHighscore() < score){
							setHighscore(score);
							document.getElementById("highscore").innerHTML = score;
						}
						setTry("valid");	
						document.getElementById("valid").innerHTML = getTry("valid");
					//Ungültiger Versuch:
					}else{
						//Setze Brotbild mit Marmeladenseite nach unten
						if (window.matchMedia("(orientation: portrait)").matches) {
							document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
						}else{
							document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
						}
						document.getElementById("time").innerHTML = time;
						document.getElementById("height").innerHTML = Math.round(height * 100) / 100;
						// Zeige an dass der Versuch ungültig ist
						document.getElementById("points").innerHTML = "FAIL";
						setTry("invalid");
						document.getElementById("invalid").innerHTML = getTry("invalid");
						
					}
					// Setze Variablen für einen festgestellten Fall zurück
					i=0;
					falling=false;
					hit=false;
					spinning=false;
					run = false;
					setSignReady(false);
				}
			}
		}
 
	}
	var previousOrientation = window.orientation;
	
	
	// Lade Hintergrundbild je nach Orientierung des Smartphones  
	var checkOrientation = function(){
		if(window.orientation !== previousOrientation){
			previousOrientation = window.orientation;
			if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
				if(run || !displayDown){
					document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
				}else if(displayDown){
					document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
				}
		    }else if(window.matchMedia("(orientation: landscape)").matches){
			    if(run || !displayDown){				
					document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
				}else if(displayDown){
					document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
				}
		    }
		}
	};

	window.addEventListener("orientationchange", checkOrientation, false);
	

}

    

