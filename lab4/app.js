const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const fs = require('fs');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }))

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
        var htmlcode = "";
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
        return colors;

    }
    );
});
//get details of a specific colour by id
app.get('/color/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        //loop through the colors array
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, send the color details to the client
            if (colors[i].colorId == req.params.id) {
                res.write(`<table> <tr> <th>ID</th> <th>Name</th> <th>Hex</th> <th>Color</th> <th>RGB</th> </tr>`)
                res.write(`<tr> 
                <td>${colors[i].colorId}</td> <td>${colors[i].name}</td> 
                <td>${colors[i].hexString}</td> <td bgcolor=\'${colors[i].hexString}\'></td> 
                <td>${colors[i].rgb['r']} ${colors[i].rgb['g']} ${colors[i].rgb['b']}</td>
                </tr> \n`);
                res.end();
            }
        }
    }
    );
});

//create a post request that just displays the data sent by the client
app.post('/color/', (req, res) => {
    console.log(req.body);
    // go to the colorid page
    res.redirect('/color/' + req.body.colorid);
});

// create a new color and add to the colors.json file
app.post('/addcolor', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        let colors = JSON.parse(data);
        let newColor = req.body;


        newColor.colorId = parseInt(newColor.colorId);
        let rgb = newColor.rgb.split(',');
        newColor.rgb = {r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2])};
        let hsl = newColor.hsl.split(',');
        newColor.hsl = {h: parseInt(hsl[0]), s: parseInt(hsl[1]), l: parseInt(hsl[2])};
        colors.push(newColor);

        //write the colors array to the colors.json file
        fs.writeFile('data/colors.json', JSON.stringify(colors), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });

        //send the new color details to the client
        res.redirect('/color/' + newColor.colorId);
    }
    );
});
//put request that modifies the data in the colors.json file
app.put('/color/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        //loop through the colors array
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, modify the color details
            if (colors[i].colorId == req.params.id) {
                colors[i].name = req.body.name;
                colors[i].hexString = req.body.hexString;
                colors[i].rgb = req.body.rgb;
                colors[i].hsl = req.body.hsl;
            }
        }
        //write the colors array to the colors.json file
        fs.writeFile('data/colors.json', JSON.stringify(colors), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        //send the modified color details to the client
        res.redirect('/color/' + req.params.id);
    }
    );
});
//delete request that removes a color from the colors.json file
app.delete('/color/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        //loop through the colors array
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, remove the color from the array
            if (colors[i].colorId == req.params.id) {
                colors.splice(i, 1);
            }
        }
        //write the colors array to the colors.json file
        fs.writeFile('data/colors.json', JSON.stringify(colors), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        //send the modified color details to the client
        res.redirect('/color/' + req.params.id);
    }
    );
});
//error handling
app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});
