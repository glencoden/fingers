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

    const tasks = [ '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', `'`, 'Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ArrowUp', 'Control', 'Alt', 'Meta', ' ', 'ArrowLeft', 'ArrowDown', 'ArrowRight', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?' ];

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
            const randomTaskIndex = Math.floor(Math.random() * tasks.length);
            const randomKey = tasks[randomTaskIndex];
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