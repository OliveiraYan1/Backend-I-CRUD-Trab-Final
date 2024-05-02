function checkEmail (request, response, next){
    const checkEmail = users.find((user) => user.email === email);

    if (checkEmail){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Email não encontrado, verifique ou crie uma conta."}))
    }

    return next();
}

export default checkEmail;