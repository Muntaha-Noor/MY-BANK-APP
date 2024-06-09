#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from 'chalk';

class  Customer  {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: string;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: string){
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
    }
}

interface IBankAccount {
    debit(amount: number) : void;
    credit(amount: number): void;
    getBalance(): number
}

// BankAccount Class:

class BankAccount implements IBankAccount {
    private balance : number
    private customer: Customer

    constructor( customer: Customer){
        this.balance = 0
        this.customer = customer
    }

    debit(amount: number): void {
        if (this.balance < amount) {
            console.log(chalk.redBright(`Transaction cancelled: Insufficient funds.`))
        }else {
            this.balance -= amount;
            console.log(chalk.greenBright(`Debited $${amount}. New balance is $${this.balance}.`));
        }
    }

    credit(amount: number): void {
            this.balance += amount;
        if(amount > 100){
            this.balance -= 1; // Deduct $1 if more than $100 is credited
            console.log(chalk.yellowBright(`$1 fee deducted for crediting more than $100.`));
        }
        console.log(chalk.greenBright(`Credited $${amount}. New balance is $${this.balance}.`))
    }

    getBalance(): number {
        return this.balance;
    }
}

async function main(){
    const customerInfo = await inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: chalk.cyanBright('Enter first name:')
        },
        {
            name: 'lastName',
            type: 'input',
            message: chalk.cyanBright('Enter last name:')
        },
        {
            name: 'gender',
            type: 'list',
            message: chalk.cyanBright('Select gender:'),
            choices: ['Male', 'Female']
        },
        {
            name: 'age',
            type: 'number',
            message: chalk.cyanBright('Enter age:')
        },
        {
            name: 'mobileNumber',
            type: 'input',
            message: chalk.cyanBright('Enter mobile number:')
        }
    ]);

    // Creating a new customer object with the provided information

    const customer = new Customer(
        customerInfo.firstName,
        customerInfo.lastName,
        customerInfo.gender,
        customerInfo.age,
        customerInfo.mobileNumber
    );

    // Creating a bank account for the customer

    const account = new BankAccount(customer);

    // Loop to interact with the bank account

    while(true){
        const action = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                message: chalk.magentaBright('What would you like to do?'),
                choices: ['Credit', 'Debit', 'Check Balance', 'Exit']
            }
        ]);

        if (action.action === 'Credit'){
            const amount = await inquirer.prompt([
                {
                    name: 'amount',
                    type: 'number',
                    message: chalk.cyanBright('Enter amount to credit:')
                }
            ]);

            account.credit(amount.amount);

        } else if (action.action === 'Debit'){
            const amount = await inquirer.prompt([
                {
                    name: 'amount',
                    type: 'number',
                    message: chalk.cyanBright('Enter amount to debit:')
                }
            ]);
            
            account.debit(amount.amount);

        } else if (action.action === 'Check Balance'){
            console.log(chalk.blueBright(`Your current balance is: $${account.getBalance()}`))
        } else {
            break;
        }
    }  
}

main();