// Convert 24-hour format to 12-hour format with AM/PM
function convertTo12HourFormat(time) {
    const [hour, minute] = time.split(':');
    let hours = parseInt(hour);
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;  // Handle midnight (00:00) as 12 AM
    return `${hours}:${minute}${period}`;
}

// Function to fetch and display the candy haul
async function getCandyHaul(zipCode, startTime, endTime) {
    // Convert both start and end times to 12-hour format
    const startTime12hr = convertTo12HourFormat(startTime);
    const endTime12hr = convertTo12HourFormat(endTime);

    // API URL with zip code, start time, and end time as query parameters
    const apiUrl = `https://nonmdwp4vf.execute-api.us-west-1.amazonaws.com/stageone/haul?zip_code=${zipCode}&start_time=${startTime12hr}&end_time=${endTime12hr}`;

    try {
        // Send the request to the API Gateway
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Failed to fetch data from API`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the predicted_haul is present in the response
        if (data.predicted_haul) {
            const predictedHaul = data.predicted_haul;

            // Calculate the total candy haul
            let totalCandy = 0;
            for (const amount of Object.values(predictedHaul)) {
                totalCandy += amount;
            }

            // Split the candy items into two columns
            const candyItems = Object.entries(predictedHaul);
            const halfLength = Math.ceil(candyItems.length / 2);
            const firstColumn = candyItems.slice(0, halfLength);
            const secondColumn = candyItems.slice(halfLength);

            // Create the result container and clear previous content
            const candyListContainer = document.getElementById('result');
            candyListContainer.innerHTML = ""; // Clear previous content

            // Create and style the columns
            const firstColumnList = document.createElement('div');
            firstColumnList.classList.add('candy-column');
            firstColumnList.style.width = "45%";  // 45% width for first column
            firstColumnList.style.display = "inline-block";  // Display columns inline
            firstColumn.forEach(([candy, amount]) => {
                const candyItem = document.createElement('div');
                candyItem.classList.add('candy-item');
                candyItem.innerText = `${candy}: ${amount}`;
                firstColumnList.appendChild(candyItem);
            });

            const secondColumnList = document.createElement('div');
            secondColumnList.classList.add('candy-column');
            secondColumnList.style.width = "45%";  // 45% width for second column
            secondColumnList.style.display = "inline-block";  // Display columns inline
            secondColumn.forEach(([candy, amount]) => {
                const candyItem = document.createElement('div');
                candyItem.classList.add('candy-item');
                candyItem.innerText = `${candy}: ${amount}`;
                secondColumnList.appendChild(candyItem);
            });

            // Append both columns to the result container
            candyListContainer.appendChild(firstColumnList);
            candyListContainer.appendChild(secondColumnList);

            // Add styles for candy items
            const candyItemsStyle = document.createElement('style');
            candyItemsStyle.innerHTML = `
                .candy-item {
                    margin: 5px 0;
                    font-size: 16px;
                    line-height: 1.5;
                }
                .candy-column {
                    padding: 10px;
                }
            `;
            document.head.appendChild(candyItemsStyle);

            // Display the total candy amount
            document.getElementById('total-candy').innerText = `Total Candy: ${totalCandy}`;
        } else if (data.error) {
            // Display error code and message from the API if data.error is present
            document.getElementById('result').innerText = `Error ${response.status}: ${data.error}`;
            document.getElementById('total-candy').innerText = '';
        }
    } catch (error) {
        // Handle any unexpected errors (e.g., network issues or other issues)
        document.getElementById('result').innerText = `Error: ${error.message}`;
        document.getElementById('total-candy').innerText = '';
    }
}

// Event listener for form submission
document.getElementById('zipcode-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get the zip code, start time, and end time entered by the user
    const zipCode = document.getElementById('zipcode-input').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    // Call the function to fetch the candy haul data
    await getCandyHaul(zipCode, startTime, endTime);
});
