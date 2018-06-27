const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const express = require('express');
const path = require('path');
app = express();

app.set('view engine','pug');
app.use('/static',express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use((request, response, next) => {
    console.log("Middleware just ran!");
    return next();
});

app.use("/users",(request, response, next) => {
    console.log("Middleware just ran on a users route!");
    return next();
});


users= [];
id = 1;


app.get("/", (request, response, next) => {
    return response.redirect("/users");
});

app.get("/users", (request, response, next) => {
    return response.render("index",{users})
});

app.get("/users/new", (request, response, next) => {
    return response.render("new",{users})
});

app.get("/users/:id", (request, response, next) => {
    const user = users.find(val => val.id === Number(request.params.id));
    return response.render("show",{user});
});

app.get("/users/:id/edit", (request, response, next) => {
    const user = users.find(val => val.id === Number(request.params.id));
    return response.render("edit",{user});
});

app.post("/users", (request, response, next) => {
    users.push({id,name:request.body.username});
    id++;
    return response.redirect("/");
});

app.patch("/users", (request, response, next) => {
    const userIndex = users.findIndex(val => val.id === Number(request.body.userid));
    if(userIndex == -1) {
        users.push({id,name:request.body.username});
        id++;
    }
    else {
        users[userIndex].name = request.body.username;
    }
    return response.redirect("/");
});

app.delete("/users/:id", (request, response, next) => {
    const userIndex = users.findIndex(val => val.id === Number(request.body.userid));
    if(userIndex == -1) {
        response.status(404);
        return response.send("User Not Found");
    }
    else {
        users.splice(userIndex,1);
        return response.redirect("/");
    }
});


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
