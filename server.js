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
        <title></title>
        <meta charset="utf-8" />
        <script type='text/javascript'>
        var map, searchManager;
    
        function GetMap() {
            map = new Microsoft.Maps.Map('#myMap', {
                credentials: 'ApmKoIWURuxK3tCczUtprA-nEzffTQpnCKRup0ZpsvNxFDi8Q7ivacUiA2gVRCBG'
            });
        }
    
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
        </script>
        <script type='text/javascript' src='http://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
    </head>
    <body>
        <input id='searchTbx' type='text'/>
        <input type='button'value='Search' onclick='Search()'/>
        <br/>
        <div id="myMap" style="position:relative;width:600px;height:400px;float:left;"></div>
        <div id='output' style="margin-left:10px;float:left;"></div>
    </body>
    </html>
    `);
  });
});

server.use(express.static('.'));

server.listen(3000, () => {
  console.log('ready');
});


//<!DOCTYPE html>
//    <html>
//      <head>
//        <title>Vue SSR Example</title>
//        <script type="importmap">
//          {
//            "imports": {
//              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
//            }
//          }
//        </script>
//        <script type="module" src="/client.js"></script>
//      </head>
//      <body>
//        <div id="app">${html}</div>
//      </body>
//    </html>

/*< !DOCTYPE html >
  <html>
    <head>
      <title></title>
      <meta charset="utf-8" />
      <script type='text/javascript'>
        var map, baseLayer, tools, currentShape;

        function GetMap() {
          map = new Microsoft.Maps.Map('#myMap', {
            credentials: 'ApmKoIWURuxK3tCczUtprA-nEzffTQpnCKRup0ZpsvNxFDi8Q7ivacUiA2gVRCBG'
          });

        //Create a base layer to add drawn shapes.
        baseLayer = new Microsoft.Maps.Layer();
        map.layers.insert(baseLayer);

        //Load the DrawingTools module.
        Microsoft.Maps.loadModule('Microsoft.Maps.DrawingTools', function () {
          //Create an instance of the DrawingTools class and bind it to the map.
          tools = new Microsoft.Maps.DrawingTools(map);

        Microsoft.Maps.Events.addHandler(tools, 'drawingChanging', function (e) {
          //When the drawing is changing, clear the base layer.
          baseLayer.clear();
            });


        //When the user presses 'esc', take the polygon out of edit mode and re-add to base map.
        document.getElementById('myMap').onkeypress = function (e) {
                if (e.charCode === 27) {
          tools.finish(shapeDrawn);
        currentShape = null;
                }
            };
        });
    }

        function drawPolygon() {
        //Stop any current drawing.
        if (currentShape) {
          tools.finish(shapeDrawn);
        currentShape = null;
        }

        //Create a new polygon.
        tools.create(Microsoft.Maps.DrawingTools.ShapeType.polygon, function (s) {
          currentShape = s;
        });
    }

        function shapeDrawn(s) {
          baseLayer.add(s);
    }
      </script>
      <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
    </head>
    <body>
      <div id="myMap" style="position:relative;width:600px;height:400px;"></div><br />
      <input type="button" onclick="drawPolygon()" value="Draw Polygon" />
    </body>
  </html> */

 /* <!DOCTYPE html>
  <html>
  <head>
      <title></title>
      <meta charset="utf-8" />
      <script type='text/javascript'>
      var map, searchManager;
  
      function GetMap() {
          map = new Microsoft.Maps.Map('#myMap', {
              credentials: 'ApmKoIWURuxK3tCczUtprA-nEzffTQpnCKRup0ZpsvNxFDi8Q7ivacUiA2gVRCBG'
          });
  
          //Make a request to geocode New York, NY.
          geocodeQuery("New York, NY");
      }
  
      function geocodeQuery(query) {
          //If search manager is not defined, load the search module.
          if (!searchManager) {
              //Create an instance of the search manager and call the geocodeQuery function again.
              Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                  searchManager = new Microsoft.Maps.Search.SearchManager(map);
                  geocodeQuery(query);
              });
          } else {
              var searchRequest = {
                  where: query,
                  callback: function (r) {
                      //Add the first result to the map and zoom into it.
                      if (r && r.results && r.results.length > 0) {
                          var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                          map.entities.push(pin);
  
                          map.setView({ bounds: r.results[0].bestView });
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
      }
      </script>
      <script type='text/javascript' src='http://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
  </head>
  <body>
      <div id="myMap" style="position:relative;width:600px;height:400px;"></div>
  </body>
  </html>

  */