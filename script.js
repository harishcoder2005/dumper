// document.addEventListener("DOMContentLoaded", function() {
//     const textElements = document.querySelectorAll(".text");
//     const names = ["Download", "High", "Quality", "Models", "and", "Materials", "For", "Free"];
//     let currentNameIndex = 0;

//     function changeText(textElement) {
//         textElement.classList.remove('fade-in');
//         setTimeout(() => {
//             textElement.textContent = names[currentNameIndex];
//             textElement.classList.add('fade-in');
//             currentNameIndex = (currentNameIndex + 1) % names.length;
//         }, 500); // Wait for the fade out effect
//     }

//     textElements.forEach((textElement) => {
//         setInterval(() => {
//             changeText(textElement);
//         }, 1000); // Change text every 3 seconds
//     });
// });




document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-text");
    const searchBtn = document.getElementById("search-btn");
    const suggestionsContainer = document.getElementById("suggestions");
    const textElements = document.querySelectorAll(".text");
    const names = ["Download", "High", "Quality", "Models", "and", "Materials", "For", "Free"];
    let currentNameIndex = 0;

    function changeText(textElement) {
        textElement.classList.remove('fade-in');
        setTimeout(() => {
            textElement.textContent = names[currentNameIndex];
            textElement.classList.add('fade-in');
            currentNameIndex = (currentNameIndex + 1) % names.length;
        }, 500);
    }

    textElements.forEach((textElement) => {
        setInterval(() => {
            changeText(textElement);
        }, 1000);
    });

    function extractWordsFromText() {
        const elementsWithText = document.querySelectorAll('h2, p'); // Adjust this selector as needed
        const words = [];
        elementsWithText.forEach(element => {
            const text = element.textContent.trim();
            const splitWords = text.split(/\s+/); // Split by whitespace to get individual words
            splitWords.forEach(word => {
                words.push({
                    word,
                    element
                });
            });
        });
        return words;
    }

    function highlightAndScrollTo(query) {
        const pageWords = extractWordsFromText();
        let firstScrollTarget = null;

        pageWords.forEach(wordData => {
            const { word, element } = wordData;
            const innerHTML = element.innerHTML; // Original innerHTML to revert after highlighting
            const regex = new RegExp(`\\b${query}\\b`, "gi"); // Match whole word, case insensitive

            const highlightedHTML = innerHTML.replace(regex, `<span class="highlight">${query}</span>`);
            element.innerHTML = highlightedHTML;

            // Scroll to the first occurrence of the query
            if (!firstScrollTarget && word.toLowerCase() === query.toLowerCase()) {
                firstScrollTarget = element;
            }
        });

        // Scroll to the first occurrence found
        if (firstScrollTarget) {
            firstScrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Revert highlight after 1 second
        setTimeout(() => {
            pageWords.forEach(wordData => {
                wordData.element.innerHTML = wordData.element.textContent; // Revert to original text
            });
        }, 1000);
    }

    searchBtn.addEventListener("click", function() {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            highlightAndScrollTo(query);
            searchInput.value = ""; // Clear input after highlighting
            suggestionsContainer.innerHTML = ""; // Clear suggestions
        }
    });

    searchInput.addEventListener("input", function() {
        const query = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = "";

        if (query) {
            const pageWords = extractWordsFromText();
            const filteredSuggestions = pageWords.filter(function(wordData) {
                return wordData.word.toLowerCase().includes(query);
            });

            filteredSuggestions.forEach(function(wordData) {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.textContent = wordData.word;
                suggestionDiv.addEventListener("click", function() {
                    wordData.element.scrollIntoView({ behavior: "smooth", block: "start" });
                    searchInput.value = wordData.word;
                    suggestionsContainer.innerHTML = "";
                });
                suggestionsContainer.appendChild(suggestionDiv);
            });
        }
    });
});
