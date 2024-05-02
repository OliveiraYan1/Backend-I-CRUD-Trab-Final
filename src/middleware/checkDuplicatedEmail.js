function checkDuplicatedEmail (request, response, next){
    const checkEmail = users.find((user) => user.email === email);

    if (checkEmail){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Email já cadastrado, insira outro."}))
    }

    return next();
}

export default checkDuplicatedEmail;