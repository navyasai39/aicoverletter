// ==========================================
// AI COVER LETTER GENERATOR - SPRINT 04
// ==========================================

// Form
const coverLetterForm = document.getElementById("coverLetterForm");

// Inputs
const candidateNameInput = document.getElementById("candidateName");
const jobRoleInput = document.getElementById("jobRole");
const companyInput = document.getElementById("company");
const skillsInput = document.getElementById("skills");

// Buttons
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

// Output
const coverLetterOutput = document.getElementById("coverLetterOutput");

// Loading
const loading = document.getElementById("loading");

// ==========================================
// BACKEND URL
// ==========================================

const API_URL = "http://localhost:5000/api/generate-cover-letter";


// ==========================================
// GENERATE COVER LETTER
// ==========================================

coverLetterForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // --------------------------------------
    // Capture form state
    // --------------------------------------

    const formState = {
        candidateName: candidateNameInput.value.trim(),
        jobRole: jobRoleInput.value.trim(),
        company: companyInput.value.trim(),
        skills: skillsInput.value.trim()
    };

    console.log("Form State:", formState);


    // --------------------------------------
    // Validate form
    // --------------------------------------

    if (
        !formState.candidateName ||
        !formState.jobRole ||
        !formState.company ||
        !formState.skills
    ) {

        alert("Please fill in all fields.");

        return;
    }


    // --------------------------------------
    // Show Generating state
    // --------------------------------------

    loading.classList.remove("hidden");

    generateBtn.disabled = true;

    generateBtn.textContent = "Generating...";

    coverLetterOutput.textContent = "";


    try {

        console.log("Sending request to backend...");


        // --------------------------------------
        // Send request to backend
        // --------------------------------------

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(formState)

        });


        // --------------------------------------
        // Read backend response
        // --------------------------------------

        const data = await response.json();

        console.log("Backend response:", data);


        // --------------------------------------
        // Handle backend error
        // --------------------------------------

        if (!response.ok) {

            throw new Error(
                data.error || "Failed to generate cover letter."
            );
        }


        // --------------------------------------
        // Display generated cover letter
        // --------------------------------------

        if (data.coverLetter) {

            coverLetterOutput.textContent = data.coverLetter;

        } else {

            throw new Error("No cover letter was returned.");

        }


    } catch (error) {

        console.error("Cover letter generation error:", error);

        coverLetterOutput.textContent =
            `Error: ${error.message}`;

    } finally {

        // --------------------------------------
        // Hide loading state
        // --------------------------------------

        loading.classList.add("hidden");


        // --------------------------------------
        // Enable button
        // --------------------------------------

        generateBtn.disabled = false;

        generateBtn.textContent = "Generate Cover Letter";

    }

});


// ==========================================
// COPY TO CLIPBOARD
// ==========================================

copyBtn.addEventListener("click", async function () {

    const text = coverLetterOutput.textContent.trim();


    if (!text) {

        alert("Please generate a cover letter first.");

        return;
    }


    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "Copied!";


        setTimeout(() => {

            copyBtn.textContent = "Copy to Clipboard";

        }, 2000);


    } catch (error) {

        console.error("Copy error:", error);

        alert("Unable to copy the cover letter.");

    }

});