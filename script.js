function pollDomElements() {
    const taskElement = document.querySelector('.task');
    const numMakesElement = document.querySelector('.num-makes');
    const numMistakesElement = document.querySelector('.num-mistakes');
    const taskLengthInput = document.querySelector('.task-length');

    if (taskElement === null || numMakesElement === null || numMistakesElement === null || taskLengthInput === null) {
        setTimeout(pollDomElements, 200);
        return;
    }

    runScript(taskElement, numMakesElement, numMistakesElement, taskLengthInput);
}

pollDomElements();

function runScript(taskElement, numMakesElement, numMistakesElement, taskLengthInput) {
    const INITIAL_TASK_LENGTH = 1;
    const MAX_TASK_LENGTH = 12;

// TODO: add Umlaute
    const tasks = [ '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', `'`, 'Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ArrowUp', 'Control', 'Alt', 'Meta', ' ', 'ArrowLeft', 'ArrowDown', 'ArrowRight', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?' ];

    const currentTasks = [];

    let numMakes = 0;
    let numMistakes = 0;

    function onMake() {
        numMakes++;
        numMakesElement.innerHTML = `${numMakes}`;
        currentTasks.shift();
        if (currentTasks.length === 0) {
            resetTasks();
            return;
        }
        updateUI();
    }

    function onMistake() {
        numMistakes++;
        numMistakesElement.innerHTML = `${numMistakes}`;
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
        taskElement.innerHTML = currentTasks.join(' ');
    }

    function resetTaskLength() {
        taskLengthInput.value = INITIAL_TASK_LENGTH;
    }

    function onTaskLengthChange({ target }) {
        taskLengthInput.value = Math.max(1, Math.min(target.value, MAX_TASK_LENGTH));
    }

    taskLengthInput.addEventListener('change', onTaskLengthChange);

    function onUserInputKeyup(event) {
        if (currentTasks.length === 0) {
            resetTasks();
            return;
        }
        if (event.key === 'Shift') {
            return;
        }
        if (event.key !== currentTasks[0]) {
            onMistake();
            return;
        }
        onMake();
    }

    document.addEventListener('keydown', onUserInputKeyup);

    resetTaskLength();
    resetTasks();
}