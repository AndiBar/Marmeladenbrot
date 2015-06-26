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
		var alpha;
		var beta;
		var gamma;
		var x_max_hit = false;
		var x_min_hit = false;
		var spin_comp = false;
		var x_count = 0;
		var y_count = 0;
		var spins_count = 0;
		document.getElementById("maxaaa").innerHTML = max_aaa;
		document.getElementById("minaaa").innerHTML = min_aaa;

		var button = document.getElementById("reset");
		button.addEventListener("click", onButtonClicked);
	

	
	
	function onButtonClicked(){
		x_count = 0;
		y_count = 0;
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
		run = true;
		setSignReady(true);
	}

				
		
	if (window.DeviceMotionEvent != undefined) {
		window.ondeviceorientation = function(event) {
			alpha = Math.round(event.alpha);
			beta = Math.round(event.beta);
			gamma = Math.round(event.gamma);

		}
		
		window.ondevicemotion = function(e) {
			if(run){

				ax = event.accelerationIncludingGravity.x * 5;
				ay = event.accelerationIncludingGravity.y * 5;
				lay = event.acceleration.z * (-1);
				document.getElementById("accelerationX").innerHTML = event.acceleration.x;
				document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
				document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;
				
				document.getElementById("spinsX").innerHTML = x_count;
				document.getElementById("spinsY").innerHTML = beta;
				document.getElementById("spinsAll").innerHTML = gamma;
		

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
					document.getElementById("maxaaa").innerHTML = max_aaa;
				}
				if(aaa < min_aaa){
					min_aaa = aaa;
					document.getElementById("minaaa").innerHTML = min_aaa;
					
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
					if(alpha <= 5){
						x_min_hit = true;
						if(x_max_hit){
							spin_comp= true;
						}
					}
					
					if(alpha >= 355){
						x_max_hit = true;
						if(x_min_hit){
							spin_comp = true;
						}
					}
					
					if(spin_comp){
						x_count++;
						x_max_hit = false;
						x_min_hit = false;
						spin_comp = false;
					}
					
				  acceleration += lay;
				  acceleration_count++;
				  
				  if(aaa>=10) {
					max=true;
					var date = new Date();
					stop_time = date.getTime();
					run = false;
				  }

				}

				if (min==true && max==true) {
				  if (window.matchMedia("(orientation: portrait)").matches) { // you're in PORTRAIT mode
						document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
				  }else{
						document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
				  }
				  i=0;
				  min=false;
				  max=false;
				  start = true;
				  time = stop_time - start_time;
				  acceleration = acceleration / acceleration_count;
				  height = acceleration * ((time/1000) * (time/1000));
				  document.getElementById("time").innerHTML = time;
				  document.getElementById("height").innerHTML = height;
				  document.getElementById("acceleration").innerHTML = acceleration;
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
				if(!run){
					document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
				}else{
					document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';
				}
		    }else{
			    if(!run){
					document.getElementById("app").style.backgroundImage = 'url(img/smashed_portrait.jpg)';
				}else{
					document.getElementById("app").style.backgroundImage = 'url(img/correct_portrait.jpg)';
				}
		    }
		}
	};

	window.addEventListener("orientationchange", checkOrientation, false);
	
	function setSignReady(ready) {
		var parentElement = document.getElementById('deviceready');
		var listeningElement = parentElement.querySelector('.smashed');
		var receivedElement = parentElement.querySelector('.ready');

		if(ready){
			listeningElement.setAttribute('style', 'display:none;');
			receivedElement.setAttribute('style', 'display:block;');
		}else{
			listeningElement.setAttribute('style', 'display:block;');
			receivedElement.setAttribute('style', 'display:none;');
		}
	}
}

    

