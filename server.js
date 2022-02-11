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