const inquirer = require('inquirer');
const choicesUser = ['Dormir à', 'Reveille à', 'Dormir maintenant'];
const allCycle = [];

async function askQuestions() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Tu veut :',
            choices: choicesUser
        }
    ]);

    if (answers.choice === choicesUser[0]) {
        await askSleepTime();
    } else if (answers.choice === choicesUser[1]) {
        await askWakeUpTime();
    } else {
        await sleepNow();
    }
}

function validHours(value) {
    const valid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
    return valid || 'Veuillez entrer une heure valide (HH:MM)';
}

async function askWakeUpTime() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name:'wakeUpAt',
            message: 'Heure de reveille : ',
            validate: validHours
        },
    ]);
    calculCycleUP(stringToTime(answers.wakeUpAt));
}

function sleepNow() {
    const day = new Date();
    const hours = day.getHours();
    const minutes = day.getMinutes();
    const timeString = `${hours}:${minutes}`;
    const actualTime = stringToTime(timeString);
    console.log(actualTime.toLocaleTimeString());
    calculCycle(actualTime);
}

function calculCycleUP(wakeUpAt) {
    for (let nbCycle = 1; nbCycle < 7; nbCycle++) {
        wakeUpAt.setHours(wakeUpAt.getHours() - 1);
        wakeUpAt.setMinutes(wakeUpAt.getMinutes() - 30);
        allCycle.push(wakeUpAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }
}

async function askSleepTime() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'sleepTime',
            message: 'Heure de dormir :',
            validate: validHours
        },
    ]);

    calculCycle(stringToTime(answers.sleepTime));
}

function stringToTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date;
}

function calculCycle(sleepTime) {
    for (let nbCycle = 1; nbCycle <= 7; nbCycle++) {
        sleepTime.setHours(sleepTime.getHours() + 1);
        sleepTime.setMinutes(sleepTime.getMinutes() + 30);
        allCycle.push(sleepTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }
}

function askWhichToUse() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'timeToWake',
            message:'le quel te convient ?:',
            choices: allCycle
        },
    ]).then(answers => {
        console.log(`tu as choisi ${answers.timeToWake} donc de dormir ${allCycle.indexOf(answers.timeToWake) + 1} cycles`);
    });
}

async function runProgram() {
    await askQuestions();
    askWhichToUse();
}

runProgram();
