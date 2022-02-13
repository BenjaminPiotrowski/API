import express from 'express';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './app.js';

const server = express();

server.get('/', (req, res) => {
  const app = createApp();

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
<html>
<head>
    <title>Map API</title>
    <meta charset="utf-8" />
    <script type='text/javascript'>
    var map, searchManager;

    //gets map API from Bing
    function GetMap() {
        map = new Microsoft.Maps.Map('#myMap', {
            credentials: 'ApmKoIWURuxK3tCczUtprA-nEzffTQpnCKRup0ZpsvNxFDi8Q7ivacUiA2gVRCBG'
        });
        addButton();
    }

    //Adds the CSS styling and the button to the web page.
    function addButton() {
      var link = document.createElement('link'); 
     
      // set the attributes for link element
      link.rel = 'stylesheet'; 
      link.type = 'text/css';
      link.href = 'button.css'; 

      // Get HTML head element to append 
      // link element to it 
      //adds styling from css file button.css
      document.getElementsByTagName('HEAD')[0].appendChild(link); 

      // Create new button Element that calls reverseGeocode
      var button = document.createElement('button'); 
      button.innerText = 'Where am I?'

      // Attach the "click" event to your button
      button.addEventListener('click', () => {
        reverseGeocode()
      })
      //Add styling from jscript side
      button.style = 'left:250px;height:100px;top: 430px; position: relative; border-radius: 50%; background-color:rgba(0,255,203,.64);'; 
      document.getElementById("myMap").appendChild(button);
    }

    //This function gets text from user and calls the search API from Bing, adding the search results to the display.
    function Search() {
        if (!searchManager) {
            //Create an instance of the search manager and perform the search.
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                searchManager = new Microsoft.Maps.Search.SearchManager(map);
                Search()
            });
        } else {
            //Remove any previous results from the map.
            map.entities.clear();

            //Get the users query and geocode it.
            var query = document.getElementById('searchTbx').value;
            geocodeQuery(query);
        }
    }

    //With the results from the Search this puts push pins in the locations found in the search
    function geocodeQuery(query) {
        var searchRequest = {
            where: query,
            callback: function (r) {
                if (r && r.results && r.results.length > 0) {
                    var pin, pins = [], locs = [], output = 'Results:<br/>';

                    for (var i = 0; i < r.results.length; i++) {
                        //Create a pushpin for each result. 
                        pin = new Microsoft.Maps.Pushpin(r.results[i].location, {
                            text: i + ''
                        });
                        pins.push(pin);
                        locs.push(r.results[i].location);

                        output += i + ') ' + r.results[i].name + '<br/>';
                    }

                    //Add the pins to the map
                    map.entities.push(pins);

                    //Display list of results
                    document.getElementById('output').innerHTML = output;

                    //Determine a bounding box to best view the results.
                    var bounds;

                    if (r.results.length == 1) {
                        bounds = r.results[0].bestView;
                    } else {
                        //Use the locations from the results to calculate a bounding box.
                        bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                    }

                    map.setView({ bounds: bounds });
                }
            },
            errorCallback: function (e) {
                //If there is an error, alert the user about it.
                alert("No results found.");
            }
        };

        //Make the geocode request.
        searchManager.geocode(searchRequest);
    }

    //This finds the center of the map calls the reverse location API and displays the location on
    //the top of the display
    function reverseGeocode() {
      //If search manager is not defined, load the search module.
      if (!searchManager) {
          //Create an instance of the search manager and call the reverseGeocode function again.
          Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
              searchManager = new Microsoft.Maps.Search.SearchManager(map);
              reverseGeocode();
          });
      } else {
          var searchRequest = {
              location: map.getCenter(),
              callback: function (r) {
                  //Tell the user the name of the result.
                  document.getElementById("titletext").innerHTML = r.name;
                  //alert(r.name);
              },
              errorCallback: function (e) {
                  //If there is an error, alert the user about it.
                  alert("Unable to reverse geocode location.");
              }
          };

          //Make the reverse geocode request.
          searchManager.reverseGeocode(searchRequest);
      }

  }

  //Check keystroke for Enter
  function clickPress(e){
    if (event.keyCode == 13) {
        //Enter was pressed
        Search();
    }
  }
  
  //down below are CSS stylig and HTML object that I chose not to build through javascript, I tried to offer a level of
  //understanding of the many ways to put together a page.
    </script>
    <script type='text/javascript' src='http://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
</head>
<body style="background-image: url('earth_panorama_4k.jpg');">
<center><h1 id='titletext' style='color:rgba(0,255,203,.64); '></h1></center>
<div alight="center" style="position:fixed;width:600px;height:400px;top:50%;left:50%">
    <div style="position:relative;top:-210px;left:-300px">
     <input id='searchTbx' style='width:529px' type='text' onkeypress="clickPress(event)"/>
     <input type='button'value='Search' onclick='Search()'/>
    
    <br/>
    
      <div id="myMap" style="position:relative;width:600px;height:400px;float:left;">
        
      </div>
      <div id='output' style="position:relative;background-color:white;margin-left:0px;float:left;height:400px;left:605px;top:-400px"></div>
    </div>
    </div>
</body>
</html>
    `);
  });
});

server.use(express.static('.'));

//output to console to notify when the page is ready to be tested.
server.listen(3000, () => {
  console.log('Web Page is Up');
});

//<input id="clickme" style="position:relative;top:400px;" type="button" value="Where Am I?" onclick="reverseGeocode();" />



