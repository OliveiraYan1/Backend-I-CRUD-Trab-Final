import express, { json } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import checkUserInput from './middleware/checkUserInput'
import checkMessage from './middleware/checkMessage';
import checkDuplicatedEmail from './middleware/checkDuplicatedEmail';
import checkEmail from './middleware/checkEmail';

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


app.get('/', (request, response) => {
    response
        .status(200)
        .send(JSON.stringify({Message: "Bem vindo à aplicação"}))
})

app.post('/signup', checkUserInput, async (request, response) => {
    const data = request.body;
    const name = data.name;
    
    if (!name){
        response
            .status(400)
            .send(JSON.stringify({Message: "Por favor, verifique se passou o nome."}));
    }

    const checkEmail = users.find((user) => user.email === data.email);

    if (checkEmail){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Email já cadastrado, insira outro."}))
    }

    const encryptPassword = await bcrypt.hash(data.password, 10);

    let newUser = {
        id: crypto.randomUUID(),
        name: name,
        email: data.email,
        password: encryptPassword,
        messages: []
    }

    users.push(newUser);

    const dataUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    }

    response.status(201).json({
        success:  true,
        message: `Seja bem vindo ${name}! Pessoa usuária cadastrada com sucesso`,
        dataResponse: dataUser
    })
})


app.post('/login', checkUserInput, async (request, response) => {
    const data = request.body;
    
    const findUser = users.find((user) => user.email === data.email);

    if (!findUser){
        response
            .status(400)
            .send(JSON.stringify({Message: "Email não encontrado no sistema, verifique ou crie uma conta"}));
    }

    const passwordMatch = await bcrypt.compare(data.password, findUser.password);

    if (!passwordMatch){
        response
            .status(400)
            .send(JSON.stringify({Message: "Senha inserida não é válida"}));
    }

    const dataResponse = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email
    }

    response
        .status(200)
        .json({
            success: true,
            message: `Seja bem vindo ${findUser.name}! Pessoa usuária logada com sucesso`,
            data: dataResponse
        });
})


app.post('/message', checkMessage, (request, response) => {
    const data = request.body;

    const email = request.query.email;

    const findUser = users.find((user) => user.email === email);

    if (!findUser){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Email não encontrado, verifique ou crie uma conta."}));
    }

    let newMessage = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description
    }

    findUser.messages.push(newMessage)

    response
        .status(200)
        .json({
            success: true,
            message: `Mensagem criada com sucesso`,
            data: newMessage
        })
})

app.get('/message/:email', (request, response) => {
    const email = request.params.email;

    const user = users.find((user) => user.email === email);

    if (!user){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Email não encontrado, verifique ou crie uma conta."}))
    }

    const userMessageList = user.messages.map((message) => `ID: ${message.id} | Título: ${message.title} | Descrição: ${message.description}`);
    const dataResponse = {
        userMessageList
    }

    response
        .status(200)
        .json({
            success: true,
            message: `Seja bem vindo! ${userMessageList}`,
            data: dataResponse
        }) 
})

app.put('/message/:id', checkMessage, (request, response) => {
    const data = request.body;
    const id = request.params.id;
    const email = request.query.email;

    if (!id){
        response
            .status(400)
            .send(JSON.stringify({Message: "Por favor, informe um id válido da mensagem"}));
    }

    const findUser = users.find((user) => user.email === email);

    const findIndexMessage = findUser.messages.findIndex((message) => message.id === id);
  
    if (findIndexMessage){
        findUser.messages[findIndexMessage].title = data.title;
        findUser.messages[findIndexMessage].description = data.description;
    }

    const dataResponse = findUser.messages[findIndexMessage];

    response
        .status(200)
        .json({
            success: true,
            message: `Recado atualizado com sucesso`,
            data: dataResponse
        }) 
}) 

app.delete('/message/:id', (request, response) => {
    const email = request.query.email;
    const id = request.params.id;

    if (!id){
        response
            .status(400)
            .send(JSON.stringify({Message: "Por favor, insira um ID"}));
    }

    const findUser = users.find((user) => user.email === email);

    const findIndexMessage = findUser.messages.findIndex((message) => message.id === id);

    if(findIndexMessage === -1){
        response
            .status(400)
            .send(JSON.stringify({Message: "Mensagem não encontrada, verifique o identificador em nosso banco"}));
    } else{
       const deletedMessage = findUser.messages.splice(findIndexMessage, 1);
        response
            .status(200)
            .json({
                success: true,
                message: "Mensagem apagada com sucesso",
                data: deletedMessage
            })

    }



})
 

app.listen(3333, () => console.log("Servidor rodando na porta 3333"));

