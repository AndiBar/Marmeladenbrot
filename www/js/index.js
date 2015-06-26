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
	screen.orientation.lock("landscape-primary");
	
        var bread = document.getElementById("sphere");
		var min = false;
		var max = false;
		var i = 0;
		var max_aaa = 0;
		var min_aaa= 1000;
		
		document.getElementById("maxaaa").innerHTML = max_aaa;
		document.getElementById("minaaa").innerHTML = min_aaa;

	var button = document.getElementById("reset");
	button.addEventListener("click", onButtonClicked);
	
	var x_start = true;
	var x_half_hit = false;
	var x_count = 0;
	var y_start = true;
	var y_half_hit = false;
	var y_count = 0;
	
	var spins_count = 0;
	
	
	function onButtonClicked(){
		min_aaa= 1000;
		max_aaa = 0;
		x_count = 0;
		y_count = 0;
		spinsAll = 0;
		document.body.style.backgroundColor = "#E4E4E4";
		document.getElementById("app").style.backgroundImage = 'url(img/correct.jpg)';

	}
		
		
		if (window.DeviceMotionEvent != undefined) {
			window.ondevicemotion = function(e) {

					
				spins_count = x_count + y_count;
				
				document.getElementById("spinsX").innerHTML = x_count;
				document.getElementById("spinsY").innerHTML = y_count;
				document.getElementById("spinsAll").innerHTML = spins_count;
				ax = event.accelerationIncludingGravity.x * 5;
				ay = event.accelerationIncludingGravity.y * 5;
				document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
				document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
				document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;
				
				y_count = event.acceleration.x;

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
				  					
				}

				if (min==true) {
				  i++;
					if(e.acceleration.x > 10)
					{
						x_max_hit = true;
						if(x_min_hit ==  true){
							spin_comp = true;
						}
					}
					
					if(e.acceleration.x > -9)
					{
						x_min_hit = true; 
						if(x_max_hit == true){
							spin_comp = true;
						}
					}
					
					if(spin_comp){
						x_count++;
						spin_comp = false;
						x_max_hit = false;
						x_min_hit = false;
					}
					
					if(e.acceleration.x > y_count){
						y_count = e.acceleration.x ;
					}
					
				}

				if (min==true && max==true) {
				
					document.getElementById("app").style.backgroundImage = 'url(img/smashed.jpg)';
				  i=0;
				  min=false;
				  max=false;
				}
				/*if (i>4) {
				  i=0;
				  min=false;
				  max=false;
				}*/

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
}
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    /*bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }*/

