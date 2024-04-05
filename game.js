const elements = [
  { name: "🔥 Fire" },
  { name: "💧 Water" },
  { name: "🌬️ Air" },
  { name: "⛰️ Earth" },
];

let selectedCards = [];

function createCardElement(element) {
  const card = document.createElement("div");
  card.classList.add("card");
  console.log("hello");
  card.textContent = `${element.name}`;
  card.onclick = function () {
    selectCard(element, card);
  };
  return card;
}

function selectCard(element, cardElement) {
  // Add the selected element to the selectedCards array
  selectedCards.push(element);

  // Visually indicate that the card has been selected
  cardElement.classList.add("selected", "glowing");

  // If two cards are selected, attempt to mix them
  if (selectedCards.length === 2) {
    mixCards();
    resetSelection(); // Deselect both cards
  }
}

async function mixCards() {
  // Check if two cards are selected
  if (selectedCards.length === 2) {
    const elementA = selectedCards[0].name.split(" ")[1].toLowerCase();
    const elementB = selectedCards[1].name.split(" ")[1].toLowerCase();

    try {
      // Replace 'your_api_endpoint' with the actual API endpoint URL
      const response = await fetch("https://soo6tg.buildship.run/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ elementA, elementB }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      // Once the response is received, stop the glowing effect
      document.querySelectorAll(".card.glowing").forEach((card) => {
        card.classList.remove("glowing");
      });
      console.log(result);
      // Assuming the result has the newElement name and firstTimeDiscovered boolean
      const newElement = {
        name: result.name,
        discovered: result.discovered, // Define how you handle symbols for new elements
      };

      const existingCard = findExistingCard(newElement);
      if (existingCard) {
        // Highlight the existing card
        highlightCard(existingCard);
      } else {
        // Create a new card element for the combination and add it to the container
        const cardContainer = document.getElementById("card-container");
        const newCardElement = createCardElement(newElement);
        cardContainer.appendChild(newCardElement);
        // Highlight the new card
        highlightCard(newCardElement);
        fetchTotalElements();
        if (newElement.discovered === false) {
          // If the element is newly discovered
          highlightNewElementCard(newCardElement);
          showToast("You discovered an element for the first time!");
        }
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }
}

async function fetchTotalElements() {
  try {
    const response = await fetch('https://soo6tg.buildship.run/getElements');
    if (!response.ok) throw new Error('Failed to fetch total elements');
    const data = await response.json();
    // Assuming the API returns { total: number }
    updateElementsDiscovered(document.querySelectorAll('#card-container .card').length, data); // Initial call with 0 discovered
  } catch (error) {
    console.error('Error fetching total elements:', error);
  }
}

function updateElementsDiscovered(discovered, total) {
  const elementsDiscoveredEl = document.getElementById('elements-discovered');
  elementsDiscoveredEl.textContent = `Elements Discovered: ${discovered} / ${total}`;
}
  

function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show the toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Hide and remove the toast after some time
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

function resetSelection() {
  // Remove 'selected' class from all cards and clear the selection array
  document.querySelectorAll(".card.selected").forEach((card) => {
    card.classList.remove("selected");
  });
  selectedCards = [];
}

function findExistingCard(newElement) {
  return Array.from(document.querySelectorAll(".card")).find((card) =>
    card.textContent.includes(newElement.name)
  );
}

// Function to highlight a card
function highlightNewElementCard(cardElement) {
    cardElement.classList.add("new-element-effect");
    // Remove the highlight after the animation duration
    setTimeout(() => {
        cardElement.classList.remove("new-element-effect");
    }, 2000); // Adjust the timeout to match your CSS animation duration
     // Scroll to the highlighted card
  cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  }

// Function to highlight a card
function highlightCard(cardElement) {
  cardElement.classList.add("highlighted");
  // Remove the highlight after the animation duration
  setTimeout(() => {
    cardElement.classList.remove("highlighted");
  }, 2000); // Adjust the timeout to match your CSS animation duration
   // Scroll to the highlighted card
   cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

}

// New function to clear all highlights
function clearHighlights() {
  const highlightedCards = document.querySelectorAll(".highlighted");
  highlightedCards.forEach((card) => {
    card.classList.remove("highlighted");
  });
}

function initGame() {
  const cardContainer = document.getElementById("card-container");
  elements.forEach((element) => {
    const cardElement = createCardElement(element);
    cardContainer.appendChild(cardElement);
  });
}

initGame();
fetchTotalElements();
