const tasks = [
    { value: '`', weight: 2 },
    { value: '1', weight: 2 },
    { value: '2', weight: 2 },
    { value: '3', weight: 2 },
    { value: '4', weight: 2 },
    { value: '5', weight: 2 },
    { value: '6', weight: 2 },
    { value: '7', weight: 2 },
    { value: '8', weight: 2 },
    { value: '9', weight: 2 },
    { value: '0', weight: 2 },
    { value: '-', weight: 2 },
    { value: '=', weight: 2 },
    { value: 'Backspace', weight: 1 },
    { value: 'Tab', weight: 1 },
    { value: 'q', weight: 1 },
    { value: 'w', weight: 1 },
    { value: 'e', weight: 1 },
    { value: 'r', weight: 1 },
    { value: 't', weight: 1 },
    { value: 'y', weight: 1 },
    { value: 'u', weight: 1 },
    { value: 'i', weight: 1 },
    { value: 'o', weight: 1 },
    { value: 'p', weight: 1 },
    { value: '[', weight: 2 },
    { value: ']', weight: 2 },
    { value: '\\', weight: 2 },
    { value: 'a', weight: 1 },
    { value: 's', weight: 1 },
    { value: 'd', weight: 1 },
    { value: 'f', weight: 1 },
    { value: 'g', weight: 1 },
    { value: 'h', weight: 1 },
    { value: 'j', weight: 1 },
    { value: 'k', weight: 1 },
    { value: 'l', weight: 1 },
    { value: ';', weight: 1 },
    { value: `'`, weight: 1 },
    { value: 'Enter', weight: 1 },
    { value: 'z', weight: 1 },
    { value: 'x', weight: 1 },
    { value: 'c', weight: 1 },
    { value: 'v', weight: 1 },
    { value: 'b', weight: 1 },
    { value: 'n', weight: 1 },
    { value: 'm', weight: 1 },
    { value: ',', weight: 1 },
    { value: '.', weight: 1 },
    { value: '/', weight: 2 },
    { value: 'ArrowUp', weight: 1 },
    { value: 'Control', weight: 2 },
    { value: 'Alt', weight: 2 },
    { value: 'Meta', weight: 2 },
    { value: ' ', weight: 0 },
    { value: 'ArrowLeft', weight: 1 },
    { value: 'ArrowDown', weight: 1 },
    { value: 'ArrowRight', weight: 1 },
    { value: '~', weight: 2 },
    { value: '!', weight: 2 },
    { value: '@', weight: 2 },
    { value: '#', weight: 2 },
    { value: '$', weight: 2 },
    { value: '%', weight: 2 },
    { value: '^', weight: 2 },
    { value: '&', weight: 2 },
    { value: '*', weight: 2 },
    { value: '(', weight: 2 },
    { value: ')', weight: 2 },
    { value: '_', weight: 2 },
    { value: '+', weight: 2 },
    { value: 'Q', weight: 1 },
    { value: 'W', weight: 1 },
    { value: 'E', weight: 1 },
    { value: 'R', weight: 1 },
    { value: 'T', weight: 1 },
    { value: 'Y', weight: 1 },
    { value: 'U', weight: 1 },
    { value: 'I', weight: 1 },
    { value: 'O', weight: 1 },
    { value: 'P', weight: 1 },
    { value: '{', weight: 2 },
    { value: '}', weight: 2 },
    { value: '|', weight: 2 },
    { value: 'A', weight: 1 },
    { value: 'S', weight: 1 },
    { value: 'D', weight: 1 },
    { value: 'F', weight: 1 },
    { value: 'G', weight: 1 },
    { value: 'H', weight: 1 },
    { value: 'J', weight: 1 },
    { value: 'K', weight: 1 },
    { value: 'L', weight: 1 },
    { value: ':', weight: 1 },
    { value: '"', weight: 1 },
    { value: 'Z', weight: 1 },
    { value: 'X', weight: 1 },
    { value: 'C', weight: 1 },
    { value: 'V', weight: 1 },
    { value: 'B', weight: 1 },
    { value: 'N', weight: 1 },
    { value: 'M', weight: 1 },
    { value: '<', weight: 2 },
    { value: '>', weight: 2 },
    { value: '?', weight: 1 },
];

function pollDomElements() {
    const taskElement = document.querySelector('.task');
    const makesElement = document.querySelector('.makes');
    const numMakesElement = document.querySelector('.num-makes');
    const numMistakesElement = document.querySelector('.num-mistakes');
    const taskLengthInput = document.querySelector('.task-length');
    const averageKeyTimeElement = document.querySelector('.average-key-time');

    if (taskElement === null || makesElement === null || numMakesElement === null || numMistakesElement === null || taskLengthInput === null || averageKeyTimeElement === null) {
        setTimeout(pollDomElements, 200);
        return;
    }

    runScript(taskElement, makesElement, numMakesElement, numMistakesElement, taskLengthInput, averageKeyTimeElement);
}

pollDomElements();

function runScript(taskElement, makesElement, numMakesElement, numMistakesElement, taskLengthInput, averageKeyTimeElement) {
    const INITIAL_TASK_LENGTH = 1;
    const MAX_TASK_LENGTH = 12;

    const currentTasks = [];
    let currentMakes = [];

    let numMakes = 0;
    let numMistakes = 0;

    let keyTimes = [];
    let prevKeyDate = null;

    function handleKeyTime() {
        const currentKeyDate = new Date();
        if (prevKeyDate === null) {
            prevKeyDate = currentKeyDate;
            return;
        }
        const timeSinceLastKey = currentKeyDate - prevKeyDate;
        keyTimes.push(timeSinceLastKey);
        const sumKeyTimes = keyTimes.reduce((result, time) => result + time, 0);
        const averageKeyTime = Math.round(sumKeyTimes / keyTimes.length);
        averageKeyTimeElement.innerHTML = `${averageKeyTime}`;
        prevKeyDate = currentKeyDate;
    }

    function onMake(key) {
        numMakes++;
        numMakesElement.innerHTML = `${numMakes}`;
        currentTasks.shift();
        currentMakes.push(key);
        if (currentTasks.length === 0) {
            resetTasks();
            return;
        }
        updateUI();
    }

    function onMistake() {
        numMistakes++;
        numMistakesElement.innerHTML = `${numMistakes}`;
        currentMakes = [];
        keyTimes = [];
        prevKeyDate = null;
        updateUI();
    }

    function resetTasks() {
        for (let i = 0; i < taskLengthInput.value; i++) {
            const pickList = [];
            tasks.forEach(task => {
                for (let i = 0; i < task.weight; i++) {
                    pickList.push(task.value);
                }
            });
            const randomTaskIndex = Math.floor(Math.random() * pickList.length);
            const randomKey = pickList[randomTaskIndex];
            currentTasks.push(randomKey);
        }
        updateUI();
    }

    function updateUI() {
        taskElement.innerHTML = currentTasks.map(parseForSpecialLabels).join(' ');
        makesElement.innerHTML = currentMakes.map(parseForSpecialLabels).join(' ');
    }

    function resetTaskLength() {
        taskLengthInput.value = INITIAL_TASK_LENGTH;
    }

    function onTaskLengthChange({ target }) {
        taskLengthInput.value = Math.max(1, Math.min(target.value, MAX_TASK_LENGTH));
    }

    taskLengthInput.addEventListener('change', onTaskLengthChange);

    function onUserInputKeydown(event) {
        event.preventDefault();
        if (currentTasks.length === 0) {
            resetTasks();
            return;
        }
        if (event.key === 'Shift') {
            return;
        }
        handleKeyTime();
        if (event.key !== currentTasks[0]) {
            onMistake();
            return;
        }
        onMake(event.key);
    }

    document.addEventListener('keydown', onUserInputKeydown);

    resetTaskLength();
    resetTasks();
}

function parseForSpecialLabels(key) {
    switch (key) {
        case 'Backspace':
            return 'Back';
        case 'Meta':
            return 'Cmd';
        case 'ArrowUp':
            return 'Up';
        case 'ArrowLeft':
            return 'Left';
        case 'ArrowDown':
            return 'Down';
        case 'ArrowRight':
            return 'Right';
        default:
            return key;
    }
}