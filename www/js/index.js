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
		//window.screen.lockOrientation("landscape-primary");
		
		//
        //var bread = document.getElementById("sphere");
		
		//Varibalen zur Feststellung des Fallens
		var min = false;
		var max = false;
		var i = 0;
		var max_aaa = 0;
		var min_aaa= 1000;
		
		//Variablen zur Berechnung der Falldauer
		var start_time = 0;
		var stop_time = 0;
		var time = 0;
		
		//Variablen zur Berechnung der Strecke
		var acceleration = 0;
		var acceleration_count = 0;
		var height = 0;
		var start = true;
		// Fall abgeschlossen bzw nicht abgeschlossen
		var run = true;
		//Smartphone landet mit dem Display nach unten
		var displayDown = false;
		
		var alpha;
		var beta;
		var gamma;
		var y_max_hit = false;
		var y_min_hit = false;
		var y_min_hit2 = false;
		var spin_comp = false;
		var x_count = 0;
		var y_count = 0;
		var spins_count = 0;

		//document.getElementById("maxaaa").innerHTML = max_aaa;
		//document.getElementById("minaaa").innerHTML = min_aaa;
		
		// Setzen der Startwerte zur Anzeige
		document.getElementById("time").innerHTML = time;
		document.getElementById("height").innerHTML = height;
		document.getElementById("points").innerHTML = 0;
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
	
	// Eventlistener zum zurücksetzen der Werte nach Klick auf Button reset
	function onButtonClicked(){
		min_aaa= 1000;
		max_aaa = 0;
		start_time = 0;
		stop_time = 0;
		time = 0;
		height = 0;
		acceleration = 0;
		acceleration_count = 0;
		document.getElementById("time").innerHTML = time;
		document.getElementById("height").innerHTML = height;
		document.getElementById("valid").innerHTML = getTry("valid");
		document.getElementById("invalid").innerHTML = getTry("invalid");
		if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
				document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
		}else{
				document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
		}
		document.getElementById("points").innerHTML = 0;
		y_count = 0;
		document.getElementById("rotations").innerHTML = y_count;
		run = true;
		start = true;
		setSignReady(true);
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
				document.getElementById("rotationAlpha").innerHTML = alpha;
				document.getElementById("rotationBeta").innerHTML = beta;
				document.getElementById("rotationGamma").innerHTML = gamma;
				document.getElementById("rotations").innerHTML = y_count;
				//document.getElementById("valid").innerHTML = getTry("valid");
				//document.getElementById("invalid").innerHTML = getTry("invalid");
				
				
		// Feststellung des Falls
				ax = event.accelerationIncludingGravity.x * 5;
				ay = event.accelerationIncludingGravity.y * 5;
				lay = event.acceleration.z * (-1);

				var aaa = Math.round(Math.sqrt(Math.pow(e.accelerationIncludingGravity.x, 2)
									+Math.pow(e.accelerationIncludingGravity.y, 2)
									+Math.pow(e.accelerationIncludingGravity.z, 2)));
				
				if(aaa > max_aaa){
					max_aaa = aaa;
				
				}
				if(aaa < min_aaa){
					min_aaa = aaa;					
				}
				
				if(gamma < 0){
					y_min_hit = true;
				}
				if(y_min_hit && (gamma > 45)){
					y_max_hit = true;
				}
				if(y_max_hit && gamma < 0){
					y_min_hit2 = true;
				}
				if(y_min_hit && y_max_hit && y_min_hit2 && gamma > 0){
					spin_comp = true;
				}
				
				if(spin_comp){
					y_count++;
					y_max_hit = false;
					y_min_hit = false;
					y_min_hit2 = false;
					spin_comp = false;
					min = true;
				}

				//if (aaa<=1) {

				if (min==true) {
				  if(start){
					//Festellung der Zeit zur Fallzeit berechnung
					var date = new Date();
					start_time = date.getTime();
					start = false;
				  }
				  i++;
					
				  if(lay > 0){
					acceleration += lay;
					acceleration_count++;
				  }
				  
				  if(aaa>=20) {
					// Fall beendet
					max=true;
					

					//Festellung der Zeit zur Fallzeit berechnung
					var date = new Date();
					stop_time = date.getTime();
					run = false;
				  }

				}
		//Festellung des Falls beendet
		
				if (min==true && max==true) {
					//Festellung welche Seite oben/ unten liegt
					if(e.accelerationIncludingGravity.z < 0){
						displayDown = true;
					}else{
						displayDown = false;
					}					
					//Gültiger Versuch:
					time = stop_time - start_time;
					acceleration = acceleration / acceleration_count;
					height = (9.81 * ((time/1000) * (time/1000))) * 0.75;
					if(displayDown){
						//Setze Brotbild mit Marmeladenseite nach unten
						if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
							document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
						}else{
							document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
						}
						//Setze Werte zur Anzeige
						setTry("valid");					
						document.getElementById("time").innerHTML = time;
						document.getElementById("height").innerHTML = Math.round(height * 100) / 100;
						//document.getElementById("acceleration").innerHTML = acceleration;
						document.getElementById("points").innerHTML = time * (Math.round(height * 100) / 100) + 1;
					//Ungültiger Versuch:
					}else{
						// Zeige an das die Werte ungültig sind
						document.getElementById("time").innerHTML = time;
						document.getElementById("height").innerHTML = Math.round(height * 100) / 100;
						//document.getElementById("acceleration").innerHTML = "ungültig";
						document.getElementById("points").innerHTML = "ungültig";
						setTry("invalid");
						
					}
					// Setze Variablen für einen festgestellten Fall zurück
					i=0;
					min=false;
					max=false;
					setSignReady(false);
				}
				/*if (i>4) {
				  i=0;
				  min=false;
				  max=false;
				}*/
			}
		}
 
	}
	var previousOrientation = window.orientation;
	
	
	// Lade Hintergrundbild je nach Orientierung des Smartphones  
	var checkOrientation = function(){
		if(window.orientation !== previousOrientation){
			previousOrientation = window.orientation;
			if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
				if(run){
					document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
				}else if(displayDown){
					document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
				}
		    }else if(window.matchMedia("(orientation: landscape)").matches){
			    if(run){				
					document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
				}else if(displayDown){
					document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
				}
		    }
		}
	};

	window.addEventListener("orientationchange", checkOrientation, false);
	

}

    

