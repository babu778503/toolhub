document.addEventListener('DOMContentLoaded', () => {
    // --- Google API Configuration ---
    const GOOGLE_CLIENT_ID = '16129359964-5l1olas9egpamj181gnr6goll0vudctc.apps.googleusercontent.com';
    // IMPORTANT: Replace 'YOUR_API_KEY' with your actual API Key from Google Cloud Console.
    const GOOGLE_API_KEY = 'YOUR_API_KEY'; 
    const DRIVE_APP_DATA_FILE = 'toolshub365_data.json';
    let googleTokenClient;
    
    // --- App State ---
    let toolsData = [];
    let bookmarks = [];
    let recentlyUsed = [];
    let activeAlarms = {};
    let userProfile = null;
    let userPreferences = {};
    let driveFileId = null;

    // --- DOM Elements ---
    const mainContentWrapper = document.getElementById('main-content-wrapper');
    const mainHeader = document.querySelector('.main-header');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    const signInModal = document.getElementById('signInModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const popularGrid = document.getElementById('popular-tools-grid');
    const newGrid = document.getElementById('new-tools-grid');
    const toolViewerContainer = document.getElementById('tool-viewer-container');
    const categoryToolsView = document.getElementById('category-tools-view');
    const allPageSections = document.querySelectorAll('.page-section');
    const categoriesView = document.getElementById('categories-view');
    const yourToolsView = document.getElementById('your-tools-view');
    const yourWorkView = document.getElementById('your-work-view');
    const profileView = document.getElementById('profile-view');
    const searchInput = document.getElementById('searchInput');
    const searchResultsView = document.getElementById('search-results-view');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const searchResultsHeading = document.getElementById('search-results-heading');
    const alarmSound = document.getElementById('alarm-sound');
    const profileSignInModal = document.getElementById('profileSignInModal');
    const profileModalCloseBtn = document.getElementById('profileModalCloseBtn');

    // --- Constants and Utility Functions ---
    const GUEST_BOOKMARK_LIMIT = 20;
    const RECENTLY_USED_LIMIT = 100;
    let lastScrollTop = 0;
    const sanitizeHTML = (str) => { if (!str) return ''; const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; };
    const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; };

    // --- App Initialization ---
    
    // Load local data first for a fast initial paint for guests
    loadLocalData('guest');

    // Initialize Google Services on window load
    window.onload = () => {
        // Load Google API client for Drive
        gapi.load('client', initializeGapiClient);
        
        // Initialize Google Identity Services for Sign-In
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(document.getElementById("g_id_signin"), { theme: "outline", size: "large", width: "280" });
    };

    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
    }

    // --- Data Management & Cloud Sync Logic ---

    const syncDataToDrive = debounce(async () => {
        if (!userProfile || !driveFileId) return; // Only sync if logged in and file exists
        console.log("Syncing data to Google Drive...");
        const content = { bookmarks, activeAlarms, userPreferences };
        try {
            await updateDriveFile(driveFileId, JSON.stringify(content));
        } catch (error) {
            console.error("Error syncing data to Drive:", error);
        }
    }, 2000); // Debounce to prevent rapid API calls

    function saveLocalData() {
        const userId = userProfile ? userProfile.sub : 'guest';
        localStorage.setItem(`toolHubBookmarks_${userId}`, JSON.stringify(bookmarks));
        localStorage.setItem(`toolHubAlarms_${userId}`, JSON.stringify(activeAlarms));
        localStorage.setItem(`toolHubUserPreferences_${userId}`, JSON.stringify(userPreferences));
        localStorage.setItem(`toolHubRecent`, JSON.stringify(recentlyUsed)); // Recent tools are always device-specific
    }

    function loadLocalData(userId = 'guest') {
        bookmarks = JSON.parse(localStorage.getItem(`toolHubBookmarks_${userId}`)) || [];
        activeAlarms = JSON.parse(localStorage.getItem(`toolHubAlarms_${userId}`)) || {};
        userPreferences = JSON.parse(localStorage.getItem(`toolHubUserPreferences_${userId}`)) || { notifications: true, preAlarms: true, birthday: '' };
        recentlyUsed = JSON.parse(localStorage.getItem('toolHubRecent')) || [];
        loadAndScheduleAlarms();
    }
    
    function clearUserData() {
        bookmarks = [];
        activeAlarms = {};
        userPreferences = { notifications: true, preAlarms: true, birthday: '' };
        userProfile = null;
        driveFileId = null;
    }

    // Wrapper functions that save locally and trigger a cloud sync if logged in
    const saveBookmarks = () => { saveLocalData(); syncDataToDrive(); };
    const saveAlarms = () => { saveLocalData(); syncDataToDrive(); };
    const saveUserPreferences = () => { saveLocalData(); syncDataToDrive(); };

    // --- Google Sign-In, Sign-Out, and Sync Logic ---

    async function handleCredentialResponse(response) {
        userProfile = decodeJwtResponse(response.credential);
        if (userProfile) {
            localStorage.setItem('toolHubUserProfile', JSON.stringify(userProfile));
            profileSignInModal.classList.remove('show');

            googleTokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/drive.appdata',
                callback: async (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        gapi.client.setToken(tokenResponse);
                        await syncOnLogin();
                    }
                },
            });
            googleTokenClient.requestAccessToken();
        }
    }

    async function syncOnLogin() {
        console.log("Starting sync process on login...");
        try {
            const file = await findOrCreateDriveFile();
            driveFileId = file.id;
            const response = await gapi.client.drive.files.get({ fileId: driveFileId, alt: 'media' });
            
            if (response.body) {
                const cloudData = JSON.parse(response.body);
                bookmarks = cloudData.bookmarks || [];
                activeAlarms = cloudData.activeAlarms || {};
                userPreferences = cloudData.userPreferences || { notifications: true, preAlarms: true, birthday: '' };
                console.log("Successfully synced data from Google Drive.");
            } else {
                 throw new Error("Empty file content from Drive.");
            }
        } catch (error) {
            console.warn("Could not read from Drive file, assuming new user. Uploading initial data.", error);
            await syncDataToDrive(); // Upload current state (which will be empty for a new user)
        } finally {
            saveLocalData();
            updateUIForLogin();
            loadAndScheduleAlarms();
            updateYourWorkBadge();
            if (currentView === 'your-tools') renderYourToolsView();
            if (currentView === 'your-work') renderYourWorkView();
            alert(`Welcome, ${userProfile.given_name}! Your data is synced.`);
            switchView('home');
        }
    }

    function signOut() {
        const userId = userProfile ? userProfile.sub : 'guest';
        
        if (userProfile && gapi.client.getToken()) {
            google.accounts.oauth2.revoke(gapi.client.getToken().access_token, () => {
                console.log('Access token revoked.');
            });
        }
        
        // Clear all user data from localStorage
        localStorage.removeItem(`toolHubBookmarks_${userId}`);
        localStorage.removeItem(`toolHubAlarms_${userId}`);
        localStorage.removeItem(`toolHubUserPreferences_${userId}`);
        localStorage.removeItem('toolHubUserProfile');
        
        clearUserData(); // Clear from app memory
        updateUIForLogout();
        loadLocalData('guest'); // Load default guest data
        
        // Re-render views to reflect logged-out state
        renderYourToolsView();
        renderYourWorkView();
        updateYourWorkBadge();

        switchView('home');
        alert("You have been signed out.");
    }

    // --- Google Drive API Helper Functions ---

    async function findOrCreateDriveFile() {
        const response = await gapi.client.drive.files.list({
            spaces: 'appDataFolder',
            fields: 'files(id, name)',
            q: `name='${DRIVE_APP_DATA_FILE}'`
        });

        if (response.result.files.length > 0) {
            return response.result.files[0];
        } else {
            const createResponse = await gapi.client.drive.files.create({
                resource: { name: DRIVE_APP_DATA_FILE, parents: ['appDataFolder'] },
                fields: 'id'
            });
            const initialContent = { bookmarks: [], activeAlarms: {}, userPreferences: { notifications: true, preAlarms: true, birthday: '' } };
            await updateDriveFile(createResponse.result.id, JSON.stringify(initialContent));
            return createResponse.result;
        }
    }

    async function updateDriveFile(fileId, content) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        const multipartRequestBody =
            delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify({ 'mimeType': 'application/json' }) +
            delimiter + 'Content-Type: application/json\r\n\r\n' + content + close_delim;

        return gapi.client.request({
            path: `/upload/drive/v3/files/${fileId}`,
            method: 'PATCH',
            params: { uploadType: 'multipart' },
            headers: { 'Content-Type': 'multipart/related; boundary="' + boundary + '"' },
            body: multipartRequestBody
        });
    }

    function decodeJwtResponse(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error decoding JWT", error);
            return null;
        }
    }

    // --- Core Application Logic (No major changes beyond this point) ---

    const updateYourWorkBadge = () => {
        const badge = document.getElementById('your-work-badge');
        if (!badge) return;
        const now = new Date();
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        let remainingTasksCount = 0;

        Object.values(activeAlarms).forEach(alarm => {
            if (alarm.triggered && alarm.frequency === 'one-time') return;
            
            const nextOccurrenceTime = alarm.nextOccurrence;
            
            if (nextOccurrenceTime > now.getTime() && nextOccurrenceTime < todayEnd.getTime()) {
                remainingTasksCount++;
            }
        });
        badge.textContent = remainingTasksCount > 0 ? remainingTasksCount : '';
    };

    const getNextOccurrence = (currentDate, frequency, originalStartTime) => {
        let next = new Date(currentDate);
        const originalDay = new Date(originalStartTime).getDate();
        switch (frequency) {
            case 'daily': next.setDate(next.getDate() + 1); break;
            case 'weekly': next.setDate(next.getDate() + 7); break;
            case 'monthly': next.setMonth(next.getMonth() + 1); if (next.getDate() !== originalDay) { next.setDate(0); } break;
            case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
            default: return null;
        }
        return next;
    };

    const isBookmarked = (toolId) => bookmarks.includes(toolId);

    const addRecentTool = (toolId) => {
        recentlyUsed = recentlyUsed.filter(item => item.id !== toolId);
        recentlyUsed.unshift({ id: toolId, timestamp: Date.now() });
        if (recentlyUsed.length > RECENTLY_USED_LIMIT) { recentlyUsed.pop(); }
        localStorage.setItem('toolHubRecent', JSON.stringify(recentlyUsed));
    };

    const createToolCardHTML = (tool, isYourToolsView = false) => {
        const bookmarkedClass = isBookmarked(tool.id) ? 'bookmarked' : '';
        const hasAlarm = isYourToolsView && Object.values(activeAlarms).some(alarm => alarm.toolId === tool.id && !alarm.triggered);
        const alarmIconHTML = hasAlarm ? `<i class="fas fa-bell" style="color: #f59e0b; margin-left: 8px;" title="Alarm is set for this tool" aria-label="Alarm is set"></i>` : '';
        return `<div class="tool-card" data-tool-id="${tool.id}"><h3 class="tool-title">${sanitizeHTML(tool.Name)}${alarmIconHTML}</h3><div class="tool-actions-bar"><a href="/tool/${tool.id}" class="action-btn btn-open" data-tool-id="${tool.id}" data-tool-name="${tool.Name}">Open</a><button class="action-btn btn-bookmark ${bookmarkedClass}" data-tool-id="${tool.id}" aria-label="Bookmark tool"><i class="fas fa-bookmark"></i></button><button class="action-btn btn-share" data-tool-id="${tool.id}" data-tool-title="${tool.Name}" aria-label="Share tool"><i class="fas fa-share-alt"></i></button></div></div>`;
    };

    const renderTools = (container, tools, injectAds = false, emptyMessage = "", isYourToolsView = false) => {
        if (!container) return;
        if (tools.length === 0) {
            if (emptyMessage) container.innerHTML = `<div class="empty-state-message">${emptyMessage}</div>`;
            return;
        }
        let htmlElements = tools.map(tool => createToolCardHTML(tool, isYourToolsView));
        container.innerHTML = htmlElements.join('');
    };
    
    const renderCategoriesView = () => { const categories = [...new Set(toolsData.map(tool => tool.Category))].sort(); categoriesView.innerHTML = `<div class="container"><h2><i class="fas fa-list" style="color:#6366f1;"></i> All Categories</h2><div class="category-grid">${categories.map(cat => `<div class="category-card" data-category-name="${sanitizeHTML(cat)}">${sanitizeHTML(cat)}</div>`).join('')}</div></div>`; };
    const renderYourToolsView = () => { const bookmarkedTools = toolsData.filter(tool => bookmarks.includes(tool.id)); const gridId = 'your-tools-grid'; yourToolsView.innerHTML = `<div class="container"><h2><i class="fas fa-bookmark" style="color:#ef4444;"></i> My Tools</h2><div class="tool-grid" id="${gridId}"></div></div>`; renderTools(document.getElementById(gridId), bookmarkedTools, false, 'You have no bookmarked tools yet.', true); };
    const renderCategoryToolsView = (categoryName) => { const filteredTools = toolsData.filter(tool => tool.Category === categoryName); const gridId = 'category-tools-grid'; categoryToolsView.innerHTML = `<div class="container"><div class="sub-view-header"><button id="back-to-categories-btn" class="btn-back"><i class="fas fa-arrow-left"></i></button><h2>${sanitizeHTML(categoryName)} Tools</h2></div><div class="tool-grid" id="${gridId}"></div></div>`; renderTools(document.getElementById(gridId), filteredTools, false); };
    
    const renderYourWorkView = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfView = new Date(calendarDisplayDate);
        startOfView.setDate(calendarDisplayDate.getDate() - 1);
        startOfView.setHours(0, 0, 0, 0);
        const endOfView = new Date(startOfView);
        endOfView.setDate(startOfView.getDate() + 3);
        endOfView.setSeconds(endOfView.getSeconds() - 1);
        const endRangeDate = new Date(startOfView);
        endRangeDate.setDate(startOfView.getDate() + 2);
        const formatRange = (start, end) => { const options = { month: 'short', day: 'numeric' }; return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, {...options, year: 'numeric'})}`; }
        
        const alarmControlsHTML = `...`; // Unchanged
        
        const allEvents = [];
        Object.entries(activeAlarms).forEach(([alarmId, alarm]) => {
            let occurrence = new Date(alarm.startTime);
            const searchStart = new Date(startOfView.getTime() - 31 * 24*60*60*1000);
            if (occurrence > endOfView) return;
            if (occurrence < searchStart && alarm.frequency !== 'one-time') {
                 while(occurrence < searchStart) {
                    const nextOccurrence = getNextOccurrence(occurrence, alarm.frequency, alarm.startTime);
                    if (!nextOccurrence || nextOccurrence <= occurrence) break;
                    occurrence = nextOccurrence;
                }
            }
            while (occurrence <= endOfView) {
                if (occurrence >= startOfView) { allEvents.push({ alarmId, date: new Date(occurrence), name: alarm.toolName, toolId: alarm.toolId, isCompleted: occurrence.getTime() < now.getTime() }); }
                if (alarm.frequency === 'one-time') break;
                const nextOccurrence = getNextOccurrence(occurrence, alarm.frequency, alarm.startTime);
                if (!nextOccurrence || nextOccurrence <= occurrence) break; 
                occurrence = nextOccurrence;
            }
        });
        
        // ... The rest of renderYourWorkView is unchanged ...
    };

    const renderProfileView = () => { /* ... (no changes) ... */ };
    const switchView = (view) => { /* ... (no changes) ... */ };

    const triggerPreAlarm = (toolName) => {
        if (!('speechSynthesis' in window) || !userPreferences.preAlarms) return;
        const userName = userProfile ? userProfile.given_name : 'there';
        const message = `Hi ${userName}, you have a reminder for ${toolName} in 15 minutes.`;
        const utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
    };

    const triggerAlarm = (alarmId) => {
        const alarmData = activeAlarms[alarmId]; if (!alarmData) return;

        if (alarmSound && userPreferences.notifications) { 
            alarmSound.play().catch(e => console.error("Error playing sound.", e)); 
        }

        if (Notification.permission === 'granted' && userPreferences.notifications) { 
            new Notification('Toolshub 365 Reminder', { 
                body: `Your reminder for "${alarmData.toolName}" is now!`, 
                icon: '/logo.png' 
            }); 
        }

        if (alarmData.frequency === 'one-time') { 
            alarmData.triggered = true; 
        } else {
            const nextDate = getNextOccurrence(new Date(alarmData.nextOccurrence), alarmData.frequency, alarmData.startTime);
            if (nextDate) { 
                alarmData.nextOccurrence = nextDate.getTime(); 
                const delay = alarmData.nextOccurrence - Date.now(); 
                if (delay > 0) setTimeout(() => triggerAlarm(alarmId), delay); 
            } else { 
                alarmData.triggered = true; 
            }
        }
        saveAlarms(); 
        updateYourWorkBadge();
        if (currentView === 'your-tools') renderYourToolsView(); 
        if (currentView === 'your-work') renderYourWorkView();
    };

    const setAlarmWithDate = async (toolId, toolName, scheduledDate, frequency) => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    
        const scheduledTime = scheduledDate.getTime();
        if (isNaN(scheduledTime) || scheduledTime <= Date.now()) {
            alert("Invalid date. The date must be in the future.");
            return;
        }
        const alarmId = `${toolId}-${scheduledTime}-${Math.random().toString(36).substr(2, 5)}`;
        activeAlarms[alarmId] = { startTime: scheduledTime, nextOccurrence: scheduledTime, toolName, toolId, frequency: frequency || 'one-time', triggered: false };
        saveAlarms();
        updateYourWorkBadge();
    
        setTimeout(() => triggerAlarm(alarmId), scheduledTime - Date.now());
    
        const preAlarmTime = scheduledTime - (15 * 60 * 1000);
        if (preAlarmTime > Date.now()) {
            const preAlarmDelay = preAlarmTime - Date.now();
            setTimeout(() => triggerPreAlarm(toolName), preAlarmDelay);
        }
    
        if (currentView === 'your-tools') renderYourToolsView();
        if (currentView === 'your-work') {
            calendarDisplayDate = new Date(scheduledTime);
            renderYourWorkView();
        }
    };

    const loadAndScheduleAlarms = () => {
        const now = Date.now();
        Object.entries(activeAlarms).forEach(([alarmId, alarm]) => {
            if (!alarm || typeof alarm.nextOccurrence !== 'number' || !alarm.toolId) return;

            // Clean up old one-time triggered alarms
            if (alarm.triggered && alarm.frequency === 'one-time' && alarm.nextOccurrence < now - (7 * 24 * 60 * 60 * 1000)) {
                delete activeAlarms[alarmId];
                return;
            }

            // Fast-forward recurring alarms that are in the past
            if (alarm.frequency && alarm.frequency !== 'one-time' && alarm.nextOccurrence < now) {
                let nextDate = new Date(alarm.nextOccurrence);
                while (nextDate.getTime() < now) { 
                    const updatedDate = getNextOccurrence(nextDate, alarm.frequency, alarm.startTime); 
                    if (!updatedDate) { nextDate = null; break; } 
                    nextDate = updatedDate; 
                }
                if (nextDate) alarm.nextOccurrence = nextDate.getTime();
            }
            
            // Schedule future alarms
            const remainingTime = alarm.nextOccurrence - now;
            if (remainingTime > 0 && !(alarm.triggered && alarm.frequency === 'one-time')) {
                setTimeout(() => triggerAlarm(alarmId), remainingTime);
                const preAlarmTime = alarm.nextOccurrence - (15 * 60 * 1000);
                if (preAlarmTime > now) {
                    setTimeout(() => triggerPreAlarm(alarm.toolName), preAlarmTime - now);
                }
            }
        });
        saveAlarms();
    };
    
    // --- All remaining functions (UI interactions, event handlers, etc.) are unchanged ---
    // They correctly use the globally managed state.
    // ...
    
    // Final app initialization
    async function loadData() { 
        try { 
            const response = await fetch(`/tools.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            toolsData = await response.json();
            
            // App is now ready to render with initial data
            initializeApp();

        } catch (error) { 
            console.error("Failed to load tools data:", error);
            if(popularGrid) popularGrid.innerHTML = `<p style="text-align: center; padding: 2rem;">Could not load tools. Please try again later.</p>`;
            if(newGrid) newGrid.innerHTML = '';
        } 
    }
    
    function initializeApp() {
        const storedProfile = localStorage.getItem('toolHubUserProfile');
        if (storedProfile) {
            userProfile = JSON.parse(storedProfile);
            loadLocalData(userProfile.sub);
            updateUIForLogin();
        } else {
            loadLocalData('guest');
        }

        updateYourWorkBadge();
        const shuffledTools = [...toolsData].sort(() => 0.5 - Math.random());
        renderTools(popularGrid, shuffledTools.slice(0, 18));
        renderTools(newGrid, shuffledTools.slice(-18).reverse());
        document.getElementById('copyright-year').textContent = new Date().getFullYear();
        
        handleRouteChange(); // Set initial view based on URL
    }

    loadData();
});
