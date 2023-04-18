const express = require('express');
var router = express.Router();
var methodOverride = require('method-override')
const app = express();
const port = 5000;
const fs = require('fs');
const bodyParser = require("body-parser");
const { Router } = require('express');
app.use(bodyParser.urlencoded({ extended: true }))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

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
        res.write('<a href="/">Home</a>');
        res.write('<table> <tr> <th>ID</th> <th>Name</th> <th>Hex</th> <th>Color</th> </tr>')
        //loop through the colors array
        var htmlcode = "";
        for (let i = 0; i < colors.length; i++) {
            //add a row to the table for each color
            htmlcode = htmlcode +
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
        //let bg = req.cookies.cookies.colorhex if it exists, if not set it to white
        try {
            var bg = req.cookies.colour.colorhex;
        }
        catch (err) {
            var bg = "white";
        }
        //loop through the colors array
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, send the color details to the client
            if (colors[i].colorId == req.params.id) {
                //if cookies are set, set the background colour to the value of the cookie
                if (bg) {
                    res.render(__dirname + "/index", {
                        colorId: colors[i].colorId, hexString: colors[i].hexString,
                        rgb: colors[i].rgb['r'] + "," + colors[i].rgb['g'] + "," + colors[i].rgb['b'],
                        hsl: colors[i].hsl['h'] + "," + colors[i].hsl['s'] + "," + colors[i].hsl['l'],
                        name: colors[i].name, bgcolour: colors[i].hexString, cbgcolour: bg
                    });

                }
                else {
                    res.render(__dirname + "/index", {
                        colorId: colors[i].colorId, hexString: colors[i].hexString,
                        rgb: colors[i].rgb['r'] + "," + colors[i].rgb['g'] + "," + colors[i].rgb['b'],
                        hsl: colors[i].hsl['h'] + "," + colors[i].hsl['s'] + "," + colors[i].hsl['l'],
                        name: colors[i].name, bgcolour: colors[i].hexString, cbgcolour: "white"
                    });
                }
                return;
            }
        }
        res.write('<h1>No color found with id: ' + req.params.id + '</h1>');
        res.write('<a href="/">Go back to home page</a>');
        res.end();
    }
    );
});


app.post('/color/', (req, res) => {
    // go to the colorid page
    res.redirect('/color/' + req.body.colorid);
});

// create a new color and add to the colors.json file
app.post('/color/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        let colors = JSON.parse(data);
        let newColor = req.body;
        //if newcolor contains null values or already exists, send an error message
        if (newColor.colorId == null || newColor.name == "" || newColor.hexString == "" || newColor.rgb == null) {
            res.status(400).send("Error: Please fill in all fields");
            return;
        }
        //if the color already exists, send an error message
        for (let i = 0; i < colors.length; i++) {
            if (colors[i].colorId == newColor.colorId) {
                res.status(400).send("Error: Color already exists");
                return;
            }
        }
        newColor.colorId = parseInt(newColor.colorId);
        let rgb = newColor.rgb.split(',');
        newColor.rgb = { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
        let hsl = newColor.hsl.split(',');
        newColor.hsl = { h: parseInt(hsl[0]), s: parseInt(hsl[1]), l: parseInt(hsl[2]) };
        colors.push(newColor);

        //write the colors array to the colors.json file
        fs.writeFile('data/colors.json', JSON.stringify(colors), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        //send the new color details to the client
        res.status(201).send(newColor);
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
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, modify the color details
            if (colors[i].colorId == req.params.id) {
                colors[i].colorId = parseInt(req.body.colorId);
                colors[i].name = req.body.name;
                colors[i].hexString = req.body.hexString;
                let rgb = req.body.rgb.split(',');
                colors[i].rgb = { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
                let hsl = req.body.hsl.split(',');
                colors[i].hsl = { h: parseInt(hsl[0]), s: parseInt(hsl[1]), l: parseInt(hsl[2]) };

                if (req.params.id != null) {
                    fs.writeFile('data/colors.json', JSON.stringify(colors), (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                }

                res.status(200).send("Color updated");
                return;
            }
        }
        res.status(400).send("Error: Color not updated");
    }
    );
});
//delete request that removes a color from the colors.json file
app.delete('/color/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(req.params.id)
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
        res.write('Color has been deleted');
        res.end();
    }
    );
});

//create a post request that goes to the next color in the colors array
app.post('/next/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        let id = parseInt(req.params.id) + 1;
        //loop through the colors array
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, go to the next color
            if (colors[i].colorId == req.params.id) {
                if (i == colors.length - 1) {
                    res.status(200).send("" + colors[0].colorId);
                    return;
                }
                else {
                    res.status(200).send("" + colors[i + 1].colorId);
                    return;
                }
            }
        }
    }
    );
});

//create a post request that goes to the previous color in the colors array
app.post('/previous/:id', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        if (err) throw err;
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        //loop through the colors array
        for (let i = 0; i < colors.length; i++) {
            //if the id matches the id in the url, go to the previous color
            if (colors[i].colorId == req.params.id) {
                if (i == 0) {
                    res.status(200).send("" + colors[colors.length - 1].colorId);
                    return;
                }
                else {
                    res.status(200).send("" + colors[i - 1].colorId);
                    return;
                }
            }
        }
    }
    );
});

//post request to save the hex string to be used as background color as a cookie
app.post('/cookie/', (req, res) => {
    //save the cookie 
    res.cookie('colour',req.body, { maxAge: 900000, httpOnly: true }).send(req.body.colorid);

});

//function if user goes to wrong url, the user is redirected to the home page
app.get('*', (req, res) => {
    //read the file colors.json
    fs.readFile('data/colors.json', 'utf8', (err, data) => {
        //parse the file into a JSON object
        let colors = JSON.parse(data);
        if(req.cookies == null){
            res.redirect('/color/' + colors[0].colorid);
        }
        else{
            res.redirect('/color/' + 0);
        }
    }
    );
});

//make app.delete and app.put on /colour/ invalid requests go to the 404 page
app.delete('/color/', (req, res) => {
    res.redirect('/404');
});
app.put('/color/', (req, res) => {
    res.redirect('/404');
});

//create a 404 page
app.get('/404', (req, res) => {
    res.write('<h1>404 Page Not Found</h1>');
    res.end();
});

