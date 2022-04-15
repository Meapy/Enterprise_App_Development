const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const fs = require('fs');

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
//load the data/colors.json file into the server
app.get('/color', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        res.write('<table> <tr> <th>ID</th> <th>Name</th> <th>Hex</th> <th>Color</th> </tr>')
        //console.log(colors);
        //loop through the colors array
        var htmlcode;
        for (let i = 0; i < colors.length; i++) {
            //add a row to the table for each color
            htmlcode =  htmlcode + 
            `<tr> 
            <td>${colors[i].colorId}</td> <td>${colors[i].name}</td> 
            <td>${colors[i].hexString}</td> <td bgcolor=\'${colors[i].hexString}\'></td> 
            </tr> \n`;

        }
        //send the table to the client
        res.write(htmlcode);
        res.end();

        //remove 'undefined' from the beginning body of the response

    }
    );


});