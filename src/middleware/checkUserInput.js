function checkUserInput (request, response, next){
    const data = request.body;
    const email = data.email;
    const password = data.password;

    if (!email){
        response
        .status(400)
        .send(JSON.stringify({Message: "Por favor, verifique se passou o email."}));
    }

    if (!password){
        response
        .status(400)
        .send(JSON.stringify({Message: "Por favor, verifique se já passou a senha."}));
    }

    return next();
}

export default checkUserInput;