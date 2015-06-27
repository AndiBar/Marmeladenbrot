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
        var bread = document.getElementById("sphere");
		var min = false;
		var max = false;
		var i = 0;
		var max_aaa = 0;
		var min_aaa= 1000;
		var start_time = 0;
		var stop_time = 0;
		var time = 0;
		var acceleration = 0;
		var acceleration_count = 0;
		var height = 0;
		var start = true;
		var run = true;
		var displayDown = false;
		var spins_count = 0;
		//document.getElementById("maxaaa").innerHTML = max_aaa;
		//document.getElementById("minaaa").innerHTML = min_aaa;
		document.getElementById("time").innerHTML = time;
		document.getElementById("height").innerHTML = height;
		document.getElementById("points").innerHTML = 0;
		document.getElementById("valid").innerHTML = getTry("valid");
		document.getElementById("invalid").innerHTML = getTry("valid");

		var button = document.getElementById("reset");
		button.addEventListener("click", onButtonClicked);

	function setSignReady(ready) {
		var parentElement = document.getElementById('deviceready');
		var showSmashed = parentElement.querySelector('.event.smashed');
		var showDropBread = parentElement.querySelector('.event.ready');

		if(ready){
			showSmashed.setAttribute('style', 'display:none;');
			showDropBread.setAttribute('style', 'display:block;');
		}else{
			showSmashed.setAttribute('style', 'display:block;');
			showDropBread.setAttribute('style', 'display:none;');
		}
	}
	
 	function getTry(tryType){
		if(localStorage.getItem(tryType) == undefined){
			localStorage.setItem(tryType,0);
		}
		if(typeof(Storage) != "undefined") {
			return localStorage.getItem(tryType);
		}
	}
	
	
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
		if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
				document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
		}else{
				document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
		}
		document.getElementById("points").innerHTML = 0;
		run = true;
		setSignReady(true);
	}

				
		
	if (window.DeviceMotionEvent != undefined) {
		
		window.ondevicemotion = function(e) {
			if(run){

				ax = event.accelerationIncludingGravity.x * 5;
				ay = event.accelerationIncludingGravity.y * 5;
				lay = event.acceleration.z * (-1);
				//document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
				//document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
				//document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;
				document.getElementById("valid").innerHTML = getTry("valid");
				document.getElementById("invalid").innerHTML = getTry("invalid");
				//document.getElementById("spinsX").innerHTML = x_count;
				//document.getElementById("spinsY").innerHTML = y_count;
		

				/*if ( e.rotationRate ) {
					document.getElementById("rotationAlpha").innerHTML = e.rotationRate.alpha;
					document.getElementById("rotationBeta").innerHTML = e.rotationRate.beta;
					document.getElementById("rotationGamma").innerHTML = e.rotationRate.gamma;
				}*/
				var aaa = Math.round(Math.sqrt(Math.pow(e.accelerationIncludingGravity.x, 2)
									+Math.pow(e.accelerationIncludingGravity.y, 2)
									+Math.pow(e.accelerationIncludingGravity.z, 2)));
				
				if(aaa > max_aaa){
					max_aaa = aaa;
				//	document.getElementById("maxaaa").innerHTML = max_aaa;
				}
				if(aaa < min_aaa){
					min_aaa = aaa;
				//	document.getElementById("minaaa").innerHTML = min_aaa;
					
				}
				

				
				if (aaa<=1) {
				  min=true;
					if(start){
					  var date = new Date();
					  start_time = date.getTime();
					  start = false;
					}
				}

				if (min==true) {
				  i++;
					
				  acceleration += lay;
				  acceleration_count++;
				  
				  if(aaa>=10) {
					max=true;
					if(e.accelerationIncludingGravity.z < 0){
						displayDown = true;
					}else{
						displayDown = false;
					}
					var date = new Date();
					stop_time = date.getTime();
					run = false;
				  }

				}

				if (min==true && max==true) {
					if(displayDown){
						if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
							document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
						}else{
							document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
						}
						setTry("valid");					
						time = stop_time - start_time;
						acceleration = acceleration / acceleration_count;
						height = acceleration * ((time/1000) * (time/1000));
						document.getElementById("time").innerHTML = time;
						document.getElementById("height").innerHTML = Math.round(height * 100) / 100;
						//document.getElementById("acceleration").innerHTML = acceleration;
						document.getElementById("points").innerHTML = time * (Math.round(height * 100) / 100) + 1;
						
					}else{
						document.getElementById("time").innerHTML = "ungültig";
						document.getElementById("height").innerHTML = "ungültig";
						//document.getElementById("acceleration").innerHTML = "ungültig";
						document.getElementById("points").innerHTML = "ungültig";
						setTry("invalid");
						
					}
					i=0;
					min=false;
					max=false;
					start = true;
					setSignReady(false);
				}
				/*if (i>4) {
				  i=0;
				  min=false;
				  max=false;
				}*/
			}
		}

		setInterval( function() {
			var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
			if ( landscapeOrientation) {
				vx = vx + ay;
				vy = vy + ax;
			} else {
				vy = vy - ay;
				vx = vx + ax;
			}
			vx = vx * 0.98;
			vy = vy * 0.98;
			y = parseInt(y + vy / 50);
			x = parseInt(x + vx / 50);
			
			boundingBoxCheck();
			
			sphere.style.top = y + "px";
			sphere.style.left = x + "px";
			
		}, 25);
	}
	var previousOrientation = window.orientation;
	
	var checkOrientation = function(){
		if(window.orientation !== previousOrientation){
			previousOrientation = window.orientation;
			if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
				if(run){
					document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
				}
		    }else{
			    if(run){				
					document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
				}
		    }
		}
	};

	window.addEventListener("orientationchange", checkOrientation, false);
	

}

    

