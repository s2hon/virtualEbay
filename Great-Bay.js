const inquirer = require ('inquirer')
const mysql = require ('mysql')
const products = [];
let newBid;
let bidItem;

const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'Yuel04Banh08',
    database: 'productDB'
});

function connect () {
    return new Promise (function (resolve){
        connection.connect(function(err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId + "\n");
            resolve();
        })
    }) 
};

function productChoice(){
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM product", function (err, res){
        if (err) throw err;
        for (let i=0; i<res.length; i++) {
            products.push(res[i].productname);
        }
        console.log(products);
        connection.end();
    })
};

function promptUser () {
    console.log('welcome to virtual eBay');
    return inquirer.prompt ([
        {type: 'confirm',
        name: 'userChoice',
        message: 'Would you like bid(Y) or post(n)?'
        },
        {type: 'input',
        name: 'productName',
        message: 'What is the product name?',
        when: answer => {return !answer.userChoice;}
        },
        {type: 'list',
        name: 'productCat',
        message: 'What is the product category?',
        choices: ['items','tasks','jobs','projects'],
        when: answer => {return !answer.userChoice;},
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
        }},
        {type: 'input',
        name: 'startBid',
        message: 'What is the starting bid amount?',
        when: answer => {return !answer.userChoice;}
        }
    ])
};

function createProduct (resOne) {
    let query = connection.query(
        "INSERT INTO product SET ?",
        {productname: resOne.productName,
        category: resOne.productCat,
        startBid: resOne.startBid
        },
        function(err, res){
            if (err) throw err;
            console.log(res.affectedRows + ' product created!');
        }
    );
    console.table(query.sql);
};

async function init () {
    try {
        await connect ();
        let resOne = await promptUser();
        switch (resOne.userChoice) {
            case false:
            userBid();
            default:
            createProduct(resOne);
        };
        
    } catch (err) {
        console.log (err);
    }
};

function userBid(res) {
    productChoice();
    let bidItem = await inquirer.prompt (
        {type: 'input',
        name: 'bidChoice',
        message: 'Which item would you like to bid on?',
        choices: products,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
            }}
        });
    for (let i=0; i<res.length; i++){
        if (res[i].productName === bidItem) {
            console.log('The starting bid for this item is'+res[i].startBid);
            bidItem = res[i].id
            if (res[i].bid !== null) {
                console.log('There is already a'+res[i].bid+'bid for this item is');
                newBid = res[i].bid;
            }
        }
    };
    let bidAmt = inquirer.prompt (
        {type: 'input',
        name: 'bidamt',
        message: 'How much would you like to bid?',
        validate: answer =>{
            if (answer.bidamt =< newBid) {
                console.log('You must to type in higher amount');
                return false;
            } else {
                return true;
                }
        }
    });
    console.log("Updating bid amt...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
            startBid: 100
        },
        {
            id: bidItem
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
    });
    console.log(query.sql);
}

