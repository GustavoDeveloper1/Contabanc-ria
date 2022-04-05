const inquire = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');


// console.log('executando ');

operation()

function operation() {

    inquire.prompt([{
        type: 'list',
        name: 'action',
        mensage: ' O que voce deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]).then((answer)=> {
        const action = answer['action'];

        console.log(action);


    }).catch(err=>console.log(err))

}