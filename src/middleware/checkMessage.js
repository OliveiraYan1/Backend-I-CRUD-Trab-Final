function checkMessage (request, response, next){
    const data = request.body;
    const title = data.title;
    const description = data.description;

    if (!title || title.length < 2){
        response
            .status(400)
            .send(JSON.stringify({Message: "Favor inserir um título"}));
    }

    if (!description || description.length < 2){
        response
            .status(400)
            .send(JSON.stringify({Message: "Favor inserir uma descrição"}));
    }

    next()
}

export default checkMessage;