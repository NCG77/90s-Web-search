const powerButton = document.getElementById("power-button");
const channelButton = document.getElementById("channel-button");
const staticSound = document.getElementById("static-sound");
const channelDisplay = document.getElementById("channel-display");

const channel1 = document.getElementById("channel-1");
const staticVideo = document.getElementById("static-video");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");
const startupSound = new Audio('assets/computer-startup.mp3');
const backgroundSound = document.getElementById("background-sound");

const muteButton = document.getElementById("mute-button");

let isPowerOn = false;
let currentChannel = 0;
let isMuted = false;

const clickSound = new Audio('assets/Mouse-click.mp3');
document.querySelector('.screen').addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
});

function togglePower() {
    isPowerOn = !isPowerOn;

    if (isPowerOn) {
        startupSound.currentTime = 0;
        startupSound.play();

        clearScreen();
        currentChannel = -1;
        switchChannel();
        staticSound.play();

        document.querySelector('.screen').style.backgroundColor = "#ffffff";
    } else {
        hideAllChannels();
        staticSound.pause();
        staticSound.currentTime = 0;
        document.querySelector('.screen').style.backgroundColor = "#000000";
    }
}

function clearScreen() {
    searchResults.innerHTML = '';
    searchResults.classList.add("hidden");
    searchInput.value = '';
    staticVideo.classList.add("hidden");
    channel1.classList.add("hidden");
    channelDisplay.classList.add("hidden");
}

function switchChannel() {
    hideAllChannels();

    currentChannel = (currentChannel + 1) % 5;

    channelDisplay.textContent = `CH${currentChannel + 1}`;
    channelDisplay.classList.remove("hidden");

    if (currentChannel !== 0) {
        staticSound.pause();
        staticSound.currentTime = 0;
    }

    setTimeout(() => {
        if (currentChannel !== 0) {
            staticSound.play();
        }
    }, 500);

    setTimeout(() => {
        channelDisplay.classList.add("hidden");

        if (currentChannel === 0) {
            channel1.classList.remove("hidden");
            staticSound.pause();
            staticSound.currentTime = 0;
        } else {
            staticVideo.classList.remove("hidden");
        }
    }, 1000);
}

function hideAllChannels() {
    channel1.classList.add("hidden");
    staticVideo.classList.add("hidden");
    channelDisplay.classList.add("hidden");
}

function performSearch(query) {
    const isUrl = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/.test(query);

    let results;
    if (isUrl) {
        const archiveUrl = `https://web.archive.org/web/1990*/http://${query.replace(/^https?:\/\//, '').replace(/^www\./, '')}`;
        results = [
            {
                title: `Internet Archive - ${query}`,
                link: archiveUrl,
                description: `Click here to view ${query} from the 90s on the Internet Archive's Wayback Machine.`
            }
        ];
    } else {
        results = [
            { title: `Search result for "${query}"`, description: `This is a search result description for "${query}"` }
        ];
    }

    searchResults.innerHTML = '';

    results.forEach(result => {
        const resultElement = document.createElement("div");
        resultElement.classList.add("result-item");

        const resultLink = document.createElement("a");
        resultLink.href = result.link || "#";
        resultLink.target = "_blank";
        resultLink.textContent = result.title;
        resultElement.appendChild(resultLink);

        const resultDesc = document.createElement("p");
        resultDesc.textContent = result.description;
        resultElement.appendChild(resultDesc);

        searchResults.appendChild(resultElement);
    });

    searchResults.classList.remove("hidden");
}

const keySound = new Audio('assets/Keystroke-sound.mp3');
searchInput.addEventListener("keydown", (e) => {
    if (e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt" && e.key !== "Meta") {
        keySound.currentTime = 0;
        keySound.play();
    }
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    }
});

backgroundSound.loop = true;
backgroundSound.play();

muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        backgroundSound.pause();
        muteButton.innerHTML = '<i class="fas fa-volume-off"></i>';
    } else {
        backgroundSound.play();
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

powerButton.addEventListener("click", togglePower);
channelButton.addEventListener("click", switchChannel);

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        performSearch(query);
    }
});
