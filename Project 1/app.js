const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;


const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>Samantha</h1>
                            <p>Start a conversation with Samantha.<br> Your chat history will be displayed here.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const JSON_FILE_PATH = 'data.json'; // myJSON file

// Define the function to load data from your local JSON file
// loadDataFromLocalJSON
const getChatResponse = async () => {
    try {
        const response = await fetch(JSON_FILE_PATH);
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data.');
        }
        const jsonData = await response.json();
        return jsonData;
        // Process the jsonData as needed
        // console.log(jsonData);
        // const name = jsonData.name;
        // return name;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return "Oops! There was an error!";
        // return null;
    }
}

/////


// Remove the typing animation, append the paragraph element, and save the chats to local storage
const removeTypingAnimation = (incomingChatDiv, pElement) => {
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

// Call the function to load data from your local JSON file
getChatResponse();

// Call the function to load data from local storage
loadDataFromLocalstorage();


function copyResponse(copyBtn) {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}


// Inside your showTypingAnimation function
const showTypingAnimation = async () => {
    // Display the typing animation
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span class="material-symbols-rounded">content_copy</span>
                </div>`;
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    // Get the chat response
    const jsonData = await getChatResponse();
    const response = getResponseForUserInput(userText, jsonData);

    // Ensure the response is a string before displaying it
    const responseText = typeof response === 'string' ? response : 'Oops! There was an error in the response.';

    // Replace the typing animation with the chat response
    const chatResponseHtml = `<div class="chat-content">
                                 <div class="chat-details">
                                    <img src="images/chatbot.jpg" alt="chatbot-img">
                                    <p>${responseText}</p>
                                 </div>
                               </div>`;
    const chatResponseDiv = createChatElement(chatResponseHtml, "incoming");
    incomingChatDiv.replaceWith(chatResponseDiv);

    // Save the chats to local storage
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

// Define a function to get a response based on user input
const getResponseForUserInput = (userInput, jsonData) => {
    if (jsonData) {
        const conversation = jsonData.conversation;
        const responseItem = conversation.find(item => item.message === userInput);
        if (responseItem) {
            return responseItem.response;
        } else {
            return "Sorry, love. I don't know what you mean.";
        }
    } else {
        return 'Oops! There was an error loading JSON data.';
    }
}

// Call the function to load data from your local JSON file
loadDataFromLocalstorage();


const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.png" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delete our conversation?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);