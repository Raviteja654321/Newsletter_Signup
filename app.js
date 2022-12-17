const express = require("express");

const https = require("https");
const bodyparser = require("body-parser");
const request=require("request");
const { url } = require("inspector");
const { resolve } = require("path");

const app = express();

app.use(express.static("Public"));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res)
{
    var firstName=req.body.fname;
    var lastName=req.body.lname;
    var email=req.body.email;

    var data={
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    var jsonData=JSON.stringify(data);

    const url="https://us12.api.mailchimp.com/3.0/lists/8de36621e6"

    const options={
        method:"POST",
        auth:"raviteja_6:172fea0d7f0702cb17e615a047ab990f-us12"
    }

    const request=https.request(url,options,function(response)
    {
        if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else 
        {
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data)
        {
            // console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function () {
    console.log("Server is running on port 3000.");
})

// APT
// 172fea0d7f0702cb17e615a047ab990f-us12
//list id
// 8de36621e6
// Subscribers link
// https://us12.admin.mailchimp.com/lists/members?id=1083274#p:1-s:25-sa:last_update_time-so:false