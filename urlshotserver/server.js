/*****************************************************************************
* urlshotserver, turns urls into pngs
* Copyright (C) 2012  Ross Jones
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*****************************************************************************/

var http = require("http");
var url  = require('url');
var fs = require("fs");
var temp = require('temp');
var phantom = require("phantom");
var im = require('imagemagick');

http.createServer(function(request, response) {

    // Read the URL from the POST body, it is a POST. Isn't it? We might accept
    // GET with params for now, for testing.
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var target_url = query['url'];
    if ( !target_url ) {
        response.writeHead(400, "text/plain")
        response.end("No URL specified")
        return;
    }

    // Check whether we have a callback and if so we can just accept the
    // request and promise, well almost promise, a callback.
    var callback_url = request.headers['X-Callback'];
    if ( callback_url ) {
        response.writeHead(200, "text/plain")
        response.end("OK - will callback")
    }

  // Fetch and process the image
  phantom.create( function(ph){
      ph.createPage(function(page){
          page.open( target_url, function(status){
              if (status == "fail") {
                  if ( ! callback_url ) {
                      response.writeHead(400, "text/plain");
                      response.end("Could not connect to " + target_url);
                  }
              } else {
                  // Generate image
                  tmpfile = temp.path({suffix: '.png'});
                  console.log(tmpfile);
                  page.render( tmpfile, function(){
                      if ( ! callback_url ) {
                          var fileStream = fs.createReadStream(tmpfile);
                          response.writeHead(200, {'Content-Type':"image/png"});
                          fileStream.pipe(response);
                      }

                      page.release();
                      ph.exit();
                  });
              }
          });
      });
  });


}).listen(8888);




