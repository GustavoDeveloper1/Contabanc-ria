const inquire = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');
const inquirer = require('inquirer');


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
    }]).then((answer) => {
        const action = answer['action'];

        if (action === 'Criar Conta') {
            createdAcount()
        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Consultar Saldo') {
            getAccountBallance()
        } else if (action === 'Sacar') {
            widthDraw()
        } else if (action === ' Sair') {
            console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));

            process.exit();
        }


    }).catch(err => console.log(err))

}

function createdAcount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('Defina as opções de sua conta a seguir'));

    buildAcount();
}

function buildAcount() {
    inquire.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:',
        },
    ]).then(answer => {
        const accountName = answer['accountName'];


        console.info(accountName);

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts');
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {

            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'));

            buildAcount();
            return;
        }

        fs.writeFileSync(`accounts/${accountName}.json`, `{"balance": 0}`, function (err) {

            console.log(err);

        },
        )

        console.log(chalk.green("Parabens, sua conta foi criada!"))
        operation()
    }).catch(err => console.log(err));
}

function deposit() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua Conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {

            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']

            addAccount(accountName, amount)
            operation()
        })
            .catch((err) => console.log(err))

    })
        .catch((err) => console.log(err))

}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Essa conta não existe!'))
        return false
    }

    return true
}

function addAccount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
        deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.bgGreen(`Foi depositado o valor de R$ ${amount} na sua conta!`))


}

function getAccount(accountName) {
    const accounJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accounJson)
}

function getAccountBallance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return getAccountBallance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Ola, o saldo da dua conta é de R$ ${accountData.balance}`))
        operation()


    }).catch(err => console.log(err))
}

function widthDraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer)=> {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return widthDraw()
        }

        inquirer.prompt([
            {
                name:' amount',
                message:'Quanto voce deseja sacar?'
            }
        ]).then((answer )=> {
            const amount = answer['amount']
            removeAmount(accountName,amount);
         
        })
        .catch(err=> console.log(err))
    })
    .catch(err => console.log(err))
}

function removeAmount(accountName,amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro tente mais tarde!"))
        return widthDraw()
    }


    if(accountData.balance < amount ) {
        console.log(chalk.bgRed.black('Saldo indisponivel!'))
        return widthDraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi Realizado um saque de R$ ${amount} na sua conta!`))
    operation()
}