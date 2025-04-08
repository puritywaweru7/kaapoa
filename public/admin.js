// Import Firestore from Firebase
import { db } from "../firebase/config.js";  // ✅ Import Firestore instance
import { collection, addDoc, getDocs, getFirestore } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firestore = getFirestore(); // Ensure Firestore is initialized

// Function to add property
document.getElementById("addPropertyForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // ✅ Prevents page reload

    // ✅ Get form values correctly
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const agentContact = document.getElementById("agentContact").value;

    try {
        // ✅ Ensure correct Firestore syntax
        await addDoc(collection(db, "properties"), {
            name,
            category,
            location,
            minPrice: parseInt(minPrice),
            maxPrice: parseInt(maxPrice),
            imageUrl,
            agentContact,
        });

        alert("Property added successfully!");
        document.getElementById("addPropertyForm").reset();
        loadProperties(); // Refresh property list
    } catch (error) {
        console.error("Error adding property:", error);
        alert("Failed to add property. Check console for details.");
    }
});

// Function to fetch and display properties
async function loadProperties() {
    const tableBody = document.getElementById("propertyList");
    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    tableBody.innerHTML = ""; // ✅ Clear existing content

    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        
        if (querySnapshot.empty) {
            console.warn("No properties found in Firestore.");
            tableBody.innerHTML = "<tr><td colspan='6'>No properties available.</td></tr>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Property Data:", data); // ✅ Debugging log

            const row = `<tr>
                <td>${data.name || "N/A"}</td>
                <td>${data.category || "N/A"}</td>
                <td>${data.location || "N/A"}</td>
                <td><img src="${data.imageUrl || 'https://via.placeholder.com/50'}" width="50"></td>
                <td>${data.minPrice || 0} - ${data.maxPrice || 0}</td>
                <td>${data.agentContact || "N/A"}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading properties:", error);
        alert("Failed to load properties. Check console for details.");
    }
}

// ✅ Load properties on page load
window.onload = loadProperties;
