// Airtable configuration
const AIRTABLE_PAT = 'pat1f9IBdZOK9PU69.b407e0b96b16eff00333e04799ad4e40ba1356052be08336eb51591a3af02902';
const AIRTABLE_BASE_ID = 'appAN1TbPo89WT3mA';
const AIRTABLE_EVENTS_TABLE = 'Events';
const AIRTABLE_USERS_TABLE = 'Users';

// User data object to store fetched profile
let user = {
    skills: [],
    interests: [],
    aspire: [],
    careerGoal: ''
};

let aiToggled = false;
let eventGridContent = '';

// Fetch user profile from Airtable
async function loadUserProfile(uid) {
    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_USERS_TABLE}?filterByFormula={UID}="${uid}"`,
            {
                headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }
            }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.records.length > 0) {
            const record = data.records[0].fields;
            user = {
                name: record.Name || 'N/A',
                email: record.Email || 'N/A',
                regno: record.RegNo || 'N/A',
                semester: record.Semester || 'N/A',
                department: record.Department || 'N/A',
                skills: record.Skills ? record.Skills.split(', ') : [],
                interests: record.Interests ? record.Interests.split(', ') : [],
                aspire: record.Passion ? [record.Passion] : [],
                careerGoal: record.Passion || ''
            };
            updateUserCard();
            updateProfileModal();
            updateModalLists();
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.getElementById('user-name').textContent = 'Error loading profile';
    }
}

// Update user card with fetched data
function updateUserCard() {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-details').textContent = `${user.department}, Semester ${user.semester}`;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-regno').textContent = user.regno;
    document.getElementById('skillsList').innerHTML = user.skills.map(skill => `<span>${skill}</span>`).join('');
    document.getElementById('interestsList').innerHTML = user.interests.map(interest => `<span>${interest}</span>`).join('');
    document.getElementById('aspireList').innerHTML = user.aspire.map(aspire => `<span>${aspire}</span>`).join('');
}

// Fetch events from Airtable (Reverted to Old Code)
async function fetchEventsFromAirtable() {
    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_EVENTS_TABLE}`,
            {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_PAT}`
                }
            }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const records = data.records;

        const eventGrid = document.getElementById("eventGrid");
        eventGrid.innerHTML = '';

        records.forEach(record => {
            const fields = record.fields;
            const name = fields.Name || 'Untitled Event';
            const date = fields.Date || 'No Date';
            const description = fields.Description || 'No Description';
            const location = fields.Location || 'No Location';
            const keywords = fields.keywords ? (Array.isArray(fields.keywords) ? fields.keywords : fields.keywords.split(',')) : [];

            const eventCard = `
                <div class="event-card visible" data-category="${keywords.join(' ').toLowerCase()}" style="background-image: url('https://png.pngtree.com/background/20220714/original/pngtree-vector-technology-circle-and-technical-background-picture-image_1613793.jpg')">
                    <div class="gradient-overlay"></div>
                    <div class="overlay">
                        <h3>${name}</h3>
                        <p>${date}</p>
                        <div class="keywords">
                            ${keywords.map(keyword => `<span>${keyword.trim()}</span>`).join('')}
                        </div>
                        <a href="#" class="know-more">Know More</a>
                    </div>
                </div>
            `;
            eventGrid.innerHTML += eventCard;
        });

        eventGridContent = eventGrid.innerHTML;
        updateCategoryFilter(records);
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        document.getElementById("eventGrid").innerHTML = '<p>Failed to load events. Please check your Personal Access Token and try again later.</p>';
    }
}

// Update category filter dynamically (Reverted to Old Code)
function updateCategoryFilter(records) {
    const categoryFilter = document.getElementById("categoryFilter");
    const allKeywords = new Set();
    records.forEach(record => {
        const keywords = record.fields.keywords ? (Array.isArray(record.fields.keywords) ? record.fields.keywords : record.fields.keywords.split(',')) : [];
        keywords.forEach(keyword => allKeywords.add(keyword.trim().toLowerCase()));
    });

    categoryFilter.innerHTML = `<li data-category="all" class="active" tabindex="0" aria-label="All Categories">All</li>`;
    allKeywords.forEach(keyword => {
        categoryFilter.innerHTML += `<li data-category="${keyword}" tabindex="0" aria-label="${keyword} Category">${keyword.charAt(0).toUpperCase() + keyword.slice(1)}</li>`;
    });
}

// Tab highlight function
function updateTabHighlight() {
    const activeTab = document.querySelector(".tabs div.active");
    const highlight = document.querySelector(".tabs .highlight");
    highlight.style.width = `${activeTab.offsetWidth}px`;
    highlight.style.left = `${activeTab.offsetLeft}px`;
}

window.addEventListener("resize", updateTabHighlight);

// Filter events based on search input
function filterEvents() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const eventCards = document.querySelectorAll(".event-card");

    eventCards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const description = card.querySelector("p:not(.keywords)").textContent.toLowerCase();
        const keywords = card.querySelector(".keywords").textContent.toLowerCase();

        if (title.includes(searchValue) || description.includes(searchValue) || keywords.includes(searchValue)) {
            card.style.display = "block";
            card.classList.add("visible");
        } else {
            card.style.display = "none";
            card.classList.remove("visible");
        }
    });
}

const debouncedFilterEvents = debounce(filterEvents, 300);

// Category filter click handler
document.getElementById("categoryFilter").addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        const category = e.target.getAttribute("data-category");
        const eventCards = document.querySelectorAll(".event-card");

        document.querySelectorAll("#categoryFilter li").forEach(li => li.classList.remove("active"));
        e.target.classList.add("active");

        eventCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            if (category === "all" || cardCategory.includes(category)) {
                card.style.display = "block";
                card.classList.add("visible");
            } else {
                card.style.display = "none";
                card.classList.remove("visible");
            }
        });

        if (aiToggled) untoggleAI();
    }
});

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll(".tabs div").forEach(tab => tab.classList.remove("active"));
    document.querySelector(`.tabs div[onclick="switchTab('${tab}')"]`).classList.add("active");
    updateTabHighlight();

    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
    document.getElementById(`${tab}Tab`).classList.add("active");

    if (tab === "events") {
        document.getElementById("eventGrid").innerHTML = eventGridContent;
        document.querySelectorAll(".event-card").forEach(card => card.classList.add("visible"));
    }
}

// Accessibility for tabs
document.querySelectorAll(".tabs div").forEach(item => {
    item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") item.click();
    });
});

// AI personalization
function personalizeSuggestions() {
    const eventCards = document.querySelectorAll(".event-card");
    eventCards.forEach(card => {
        const keywords = card.querySelector(".keywords").textContent.toLowerCase();
        const skillMatch = user.skills.some(skill => keywords.includes(skill.toLowerCase()));
        const goalMatch = keywords.includes(user.careerGoal.toLowerCase());

        if (skillMatch || goalMatch) {
            card.style.opacity = "1";
            card.style.border = "2px solid #1e3a8a";
        } else {
            card.style.opacity = "0.5";
            card.style.border = "none";
        }
    });
}

function toggleAIPersonalization() {
    const aiButton = document.getElementById("aiButton");
    if (!aiToggled) {
        personalizeSuggestions();
        aiButton.textContent = "Untoggle AI";
        aiButton.classList.add("toggled");
        aiToggled = true;
    } else {
        untoggleAI();
    }
}

function untoggleAI() {
    const eventCards = document.querySelectorAll(".event-card");
    eventCards.forEach(card => {
        card.style.opacity = "1";
        card.style.border = "none";
    });
    const aiButton = document.getElementById("aiButton");
    aiButton.textContent = "AI Personalize";
    aiButton.classList.remove("toggled");
    aiToggled = false;
}

// Modal functions
function openEditModal() {
    document.getElementById("editModal").style.display = "flex";
}

function openEditModalFromProfile() {
    closeProfileModal();
    openEditModal();
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

function openProfileModal() {
    document.getElementById("profileModal").style.display = "flex";
}

function closeProfileModal() {
    document.getElementById("profileModal").style.display = "none";
}

function addItem(type, selectElement) {
    const value = selectElement.value;
    if (!value) return;

    if (type === "aspire" && user[type].length >= 1) {
        alert("You can only have one aspiration.");
        return;
    }

    if (!user[type].includes(value)) {
        if (type === "aspire") user[type] = [value];
        else user[type].push(value);
        updateModalLists();
        updateUserCard();
        updateProfileModal();
    }
    selectElement.value = "";
}

function removeItem(type, item) {
    user[type] = user[type].filter(i => i !== item);
    updateModalLists();
    updateUserCard();
    updateProfileModal();
}

function updateModalLists() {
    document.getElementById("modalSkillsList").innerHTML = user.skills.map(item => `
        <span>${item}<i class="fas fa-times" onclick="removeItem('skills', '${item}')"></i></span>
    `).join("");
    document.getElementById("modalInterestsList").innerHTML = user.interests.map(item => `
        <span>${item}<i class="fas fa-times" onclick="removeItem('interests', '${item}')"></i></span>
    `).join("");
    document.getElementById("modalAspireList").innerHTML = user.aspire.map(item => `
        <span>${item}<i class="fas fa-times" onclick="removeItem('aspire', '${item}')"></i></span>
    `).join("");
}

function updateProfileModal() {
    document.getElementById("profileModal-name").textContent = user.name;
    document.getElementById("profileModal-details").textContent = `${user.department}, Semester ${user.semester}`;
    document.getElementById("profileModal-email").textContent = user.email;
    document.getElementById("profileModal-regno").textContent = user.regno;
    document.getElementById("profileSkillsList").innerHTML = user.skills.map(skill => `<span>${skill}</span>`).join("");
    document.getElementById("profileInterestsList").innerHTML = user.interests.map(interest => `<span>${interest}</span>`).join("");
    document.getElementById("profileAspireList").innerHTML = user.aspire.map(aspire => `<span>${aspire}</span>`).join("");
}

function saveProfile() {
    const uid = localStorage.getItem('uid');
    const userData = {
        fields: {
            UID: uid,
            Name: user.name,
            RegNo: user.regno,
            Email: user.email,
            Semester: user.semester,
            Department: user.department,
            Skills: user.skills.join(', '),
            Interests: user.interests.join(', '),
            Passion: user.aspire[0] || ''
        }
    };

    fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_USERS_TABLE}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: [{ id: getRecordId(uid), fields: userData.fields }] })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Update failed: ${response.status}`);
        return response.json();
    })
    .then(() => {
        updateUserCard();
        updateProfileModal();
        closeModal();
    })
    .catch(error => console.error('Error updating profile:', error));
}

async function getRecordId(uid) {
    const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_USERS_TABLE}?filterByFormula={UID}="${uid}"`,
        { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` } }
    );
    const data = await response.json();
    return data.records[0].id;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Modal click-to-close
document.getElementById("editModal").addEventListener("click", function(e) {
    if (e.target === this) closeModal();
});

document.getElementById("profileModal").addEventListener("click", function(e) {
    if (e.target === this) closeProfileModal();
});

// Desktop scroll behavior
if (window.innerWidth > 768) {
    let lastScrollTopDesktop = 0;
    window.addEventListener("scroll", function() {
        const searchFilter = document.getElementById("searchFilter");
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTopDesktop) {
            searchFilter.classList.add("hidden");
        } else {
            searchFilter.classList.remove("hidden");
        }
        lastScrollTopDesktop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });
}

// Mobile scroll behavior
if (window.innerWidth <= 768) {
    let lastScrollTopMobile = 0;
    window.addEventListener("scroll", function() {
        const tabs = document.getElementById("tabs");
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTopMobile) {
            tabs.classList.add("hidden");
        } else {
            tabs.classList.remove("hidden");
        }
        lastScrollTopMobile = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });
}