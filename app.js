document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // YOUR FIREBASE CONFIGURATION OBJECT
    // =================================================================
    const firebaseConfig = {
        apiKey: "AIzaSyCjMwxIxNDXis4dfyNAkg8wqvD20V08R54",
        authDomain: "toolhub-free-app-40b82.firebaseapp.com",
        projectId: "toolhub-free-app-40b82",
        storageBucket: "toolhub-free-app-40b82.firebasestorage.app",
        messagingSenderId: "208793911052",
        appId: "1:208793911052:web:a15fb9a13f753c276cd329",
        measurementId: "G-1MPE96CKD2"
    };
    // =================================================================

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();

    const GOOGLE_CLIENT_ID = '16129359964-5l1olas9egpamj181gnr6goll0vudctc.apps.googleusercontent.com';
    let toolsData = [];
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
    const popularToolsSection = document.getElementById('popular-tools-section');
    const newToolsSection = document.getElementById('new-tools-section');
    const alarmSound = document.getElementById('alarm-sound');
    let currentView = 'home';
    let previousView = 'home';
    let calendarDisplayDate = new Date();

    // Data variables - these will be populated from localStorage or Firestore
    let bookmarks = [];
    let recentlyUsed = [];
    let activeAlarms = {};
    let userPreferences = {};

    let userProfile = null;
    let firestoreListener = null; // To hold the real-time listener

    const GUEST_BOOKMARK_LIMIT = 20;
    const RECENTLY_USED_LIMIT = 100;
    const sanitizeHTML = (str) => { if (!str) return ''; const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; };


    // =================================================================
    // DATA STORAGE LOGIC (NOW HANDLES GUEST vs. LOGGED-IN USER)
    // =================================================================

    // Loads guest data from localStorage. This is the default state.
    const loadGuestData = () => {
        bookmarks = JSON.parse(localStorage.getItem('toolHubGuestBookmarks')) || [];
        recentlyUsed = JSON.parse(localStorage.getItem('toolHubGuestRecent')) || [];
        activeAlarms = JSON.parse(localStorage.getItem('toolHubGuestAlarms')) || {};
        userPreferences = JSON.parse(localStorage.getItem('toolHubGuestUserPreferences')) || {};
        if (userPreferences.notifications === undefined) userPreferences.notifications = true;
        if (userPreferences.preAlarms === undefined) userPreferences.preAlarms = true;
    };

    // Saves data to localStorage ONLY for guest users.
    const saveGuestData = () => {
        if (userProfile) return; // Do not save to guest storage if a user is logged in
        localStorage.setItem('toolHubGuestBookmarks', JSON.stringify(bookmarks));
        localStorage.setItem('toolHubGuestRecent', JSON.stringify(recentlyUsed));
        localStorage.setItem('toolHubGuestAlarms', JSON.stringify(activeAlarms));
        localStorage.setItem('toolHubGuestUserPreferences', JSON.stringify(userPreferences));
    };

    // Saves the current state of the app's data to Firestore for the logged-in user.
    const saveDataToFirestore = async () => {
        if (!userProfile) return;
        const userData = {
            bookmarks,
            recentlyUsed,
            activeAlarms,
            userPreferences,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        try {
            await db.collection('users').doc(userProfile.uid).set(userData, { merge: true });
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
        }
    };


    // =================================================================
    // AUTHENTICATION AND DATA SYNCING LOGIC
    // =================================================================

    // This function runs whenever the user's auth state changes (login/logout).
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in.
            userProfile = user;
            updateUIForLogin();
            
            // Detach any existing listener to avoid duplicates.
            if (firestoreListener) firestoreListener();

            // Set up a real-time listener for this user's data.
            firestoreListener = db.collection('users').doc(user.uid).onSnapshot((doc) => {
                if (doc.exists) {
                    // Data exists in the cloud, load it into the app.
                    const data = doc.data();
                    bookmarks = data.bookmarks || [];
                    recentlyUsed = data.recentlyUsed || [];
                    activeAlarms = data.activeAlarms || {};
                    userPreferences = data.userPreferences || {};
                } else {
                    // New user. Merge guest data with cloud.
                    console.log("New user, merging guest data.");
                    bookmarks = [...new Set([...bookmarks, ...(JSON.parse(localStorage.getItem('toolHubGuestBookmarks')) || [])])];
                    saveDataToFirestore(); // Save merged data to cloud
                }
                
                // Refresh the entire UI with the synced data.
                loadAndScheduleAlarms();
                updateYourWorkBadge();
                if(currentView === 'your-tools') renderYourToolsView();
                if(currentView === 'your-work') renderYourWorkView();
                if(currentView === 'profile') renderProfileView();

            }, (error) => {
                console.error("Error with Firestore listener:", error);
            });

        } else {
            // User is signed out.
            userProfile = null;
            updateUIForLogout();
            
            // Detach the real-time listener.
            if (firestoreListener) firestoreListener();
            
            // Revert to guest data from localStorage.
            loadGuestData();
            loadAndScheduleAlarms();
            updateYourWorkBadge();
            if(currentView === 'your-tools' || currentView === 'your-work' || currentView === 'profile') {
                switchView('home');
            } else {
                 if(currentView === 'your-tools') renderYourToolsView();
                 if(currentView === 'your-work') renderYourWorkView();
            }
        }
    });

    function handleCredentialResponse(response) {
        const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
        auth.signInWithCredential(credential).catch((error) => {
            console.error("Firebase sign-in error", error);
        });
    }

    function updateUIForLogin() {
        if (!userProfile) return;
        const profileLink = document.getElementById('profile-link');
        profileLink.innerHTML = `<img src="${userProfile.photoURL}" alt="User profile picture"> ${sanitizeHTML(userProfile.displayName.split(' ')[0])}`;
        profileLink.title = `Signed in as ${userProfile.displayName}. Click to view profile.`;
        profileLink.classList.add('logged-in');
        profileSignInModal.classList.remove('show');
    }

    function updateUIForLogout() {
        const profileLink = document.getElementById('profile-link');
        profileLink.innerHTML = `<i class="fas fa-user-circle"></i> Profile`;
        profileLink.title = '';
        profileLink.classList.remove('logged-in');
    }

    function signOut() {
        auth.signOut();
        alert("You have been signed out.");
    }

    // This part stays the same for initializing the Google Sign-In button
    window.onload = function () {
        if (typeof google === 'undefined') {
            console.warn("Google Identity Services script not loaded.");
            return;
        }
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("g_id_signin"),
            { theme: "outline", size: "large", width: "280" }
        );
    };

    // =================================================================
    // MODIFIED CORE APP FUNCTIONS
    // =================================================================

    const handleBookmarkClick = (button) => {
        const toolId = button.dataset.toolId; if (!toolId) return;
        const isCurrentlyBookmarked = bookmarks.includes(toolId);
        
        if (isCurrentlyBookmarked) {
            bookmarks = bookmarks.filter(id => id !== toolId);
            button.classList.remove('bookmarked');
        } else {
            if (!userProfile && bookmarks.length >= GUEST_BOOKMARK_LIMIT) {
                showModal();
                return;
            }
            bookmarks.push(toolId);
            button.classList.add('bookmarked');
        }

        userProfile ? saveDataToFirestore() : saveGuestData();
        if (currentView === 'your-tools') renderYourToolsView();
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
        
        userProfile ? saveDataToFirestore() : saveGuestData();
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


    // The rest of your app.js file remains largely the same, only the data saving/loading parts are changed.
    // All functions that call `saveBookmarks()`, `saveAlarms()` etc. are now replaced by `saveGuestData()` or `saveDataToFirestore()`
    // Here is the rest of the file for completeness, with minor modifications where data is written.

    const unlockAudio = () => {
        alarmSound.play().catch(() => {});
        alarmSound.pause();
        alarmSound.currentTime = 0;
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0;
            window.speechSynthesis.speak(utterance);
            window.speechSynthesis.cancel(); 
        }
    };
    document.body.addEventListener('click', unlockAudio, { once: true });

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

    const addRecentTool = (toolId) => {
        recentlyUsed = recentlyUsed.filter(item => item.id !== toolId);
        recentlyUsed.unshift({ id: toolId, timestamp: Date.now() });
        if (recentlyUsed.length > RECENTLY_USED_LIMIT) { recentlyUsed.pop(); }
        userProfile ? saveDataToFirestore() : saveGuestData();
    };

    const createToolCardHTML = (tool, isYourToolsView = false) => {
        const bookmarkedClass = bookmarks.includes(tool.id) ? 'bookmarked' : '';
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
        
        const alarmControlsHTML = `
            <div class="alarm-controls-wrapper">
                <div class="alarm-control">
                    <i class="fas fa-bell"></i>
                    <label class="on-off-switch">
                        <input type="checkbox" id="main-alarm-toggle" ${userPreferences.notifications ? 'checked' : ''}>
                        <span></span>
                    </label>
                </div>
                <div class="alarm-control">
                    <i class="fas fa-bullhorn"></i>
                    <label class="on-off-switch">
                        <input type="checkbox" id="pre-alarm-toggle" ${userPreferences.preAlarms ? 'checked' : ''}>
                        <span></span>
                    </label>
                </div>
            </div>`;

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
        let calendarHtml = '';
        for (let i = 0; i < 3; i++) {
            const day = new Date(startOfView);
            day.setDate(startOfView.getDate() + i);
            const dayDate = day.getDate();
            const dayName = day.toLocaleDateString(undefined, { weekday: 'short' });
            const fullDateStr = day.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const isTodayClass = day.getTime() === today.getTime() ? 'is-today' : '';
            const isActiveDateClass = day.getTime() === new Date(calendarDisplayDate.getFullYear(), calendarDisplayDate.getMonth(), calendarDisplayDate.getDate()).getTime() ? 'is-active-date' : '';
            const eventsForDay = allEvents.filter(event => event.date.getFullYear() === day.getFullYear() && event.date.getMonth() === day.getMonth() && event.date.getDate() === day.getDate()).sort((a,b) => a.date - b.date);
            const isEmptyClass = eventsForDay.length === 0 ? 'is-empty' : '';
            let eventsHtml = eventsForDay.map(event => {
                const timeString = event.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                return `<div class="calendar-event ${event.isCompleted ? 'is-completed' : ''}" data-tool-id="${event.toolId}" data-tool-name="${sanitizeHTML(event.name)}" title="${sanitizeHTML(event.name)} at ${timeString}">
                    <span class="event-name">${sanitizeHTML(event.name)}</span>
                    <div class="event-actions">
                        <span class="event-time">${timeString}</span>
                        <button class="delete-event-btn" data-alarm-id="${event.alarmId}">&times;</button>
                    </div>
                </div>`;
            }).join('');
            calendarHtml += `<div class="calendar-day ${isTodayClass} ${isActiveDateClass} ${isEmptyClass}"><div class="mobile-event-sidebar"><span>My Work (task)</span></div><div class="mobile-event-main-content"><div class="calendar-day-full-date">${fullDateStr}</div><div class="calendar-day-header"><span class="day-name">${dayName}</span><span class="day-number">${dayDate}</span></div><div class="calendar-events-container">${eventsHtml}</div></div></div>`;
        }
        yourWorkView.innerHTML = `<div class="container">
            <div class="your-work-header">
                <h2><i class="fas fa-briefcase" style="color:#7c3aed;"></i> My Work</h2>
                ${alarmControlsHTML}
            </div>
            <div class="your-work-controls">
                <button id="calendar-today-btn">Today</button>
                <button id="calendar-prev-btn"><i class="fas fa-chevron-left"></i></button>
                <button id="calendar-next-btn"><i class="fas fa-chevron-right"></i></button>
                <span class="your-work-date-range">${formatRange(startOfView, endRangeDate)}</span>
            </div>
            <div class="calendar-container">
                <div class="calendar-grid">${calendarHtml}</div>
            </div>
        </div>`;
    };

    const renderProfileView = () => {
        if (!userProfile) {
            profileSignInModal.classList.add('show');
            switchView('home');
            return;
        }

        const checkedAttribute = userPreferences.notifications ? 'checked' : '';
        profileView.innerHTML = `
            <div class="container">
                <div class="profile-card">
                    <div class="profile-header">
                        <img src="${userProfile.photoURL}" alt="User profile avatar" class="profile-avatar">
                        <h2 class="profile-name">${sanitizeHTML(userProfile.displayName)}</h2>
                        <p class="profile-email">${sanitizeHTML(userProfile.email)}</p>
                    </div>
                    <div class="profile-form">
                        <div class="form-group">
                            <label for="profile-birthday">Birthday</label>
                            <input type="date" id="profile-birthday" value="${userPreferences.birthday || ''}">
                        </div>
                        <div class="form-group form-group-inline">
                            <label for="notification-toggle">App Notifications</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="notification-toggle" ${checkedAttribute}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn-save" id="profile-save-btn">Save Changes</button>
                        <button class="btn-sign-out" id="profile-sign-out-btn">Sign Out</button>
                    </div>
                </div>
            </div>`;
    };

    const switchView = (view) => {
        if (currentView !== view) { previousView = currentView; }
        currentView = view;
        window.scrollTo({ top: 0, behavior: 'auto' });
        
        mainNav.querySelectorAll('a[data-view]').forEach(link => {
            link.classList.toggle('active', link.dataset.view === view);
        });

        allPageSections.forEach(section => {
            section.style.display = section.dataset.viewGroup.includes(view) ? '' : 'none';
        });

        if (searchInput.value !== '') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
        hideTool(false);
        hideCategoryTools();
        
        if (view === 'categories' && !categoriesView.innerHTML) renderCategoriesView();
        if (view === 'your-tools') renderYourToolsView();
        if (view === 'your-work') renderYourWorkView();
        if (view === 'profile') renderProfileView();
        
        if (mainNav.classList.contains('active')) mainNav.classList.remove('active');
    };

    const triggerPreAlarm = (toolName) => {
        if (!('speechSynthesis' in window) || !userPreferences.preAlarms) {
            return;
        }
        const userName = userProfile ? userProfile.displayName.split(' ')[0] : 'there';
        const message = `Hi ${userName}, you have a reminder for ${toolName} in 15 minutes.`;
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;
        
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
                if (delay > 0) { 
                    setTimeout(() => triggerAlarm(alarmId), delay); 
                } 
            } else { 
                alarmData.triggered = true; 
            }
        }
        userProfile ? saveDataToFirestore() : saveGuestData();
        updateYourWorkBadge();
        if (currentView === 'your-tools') renderYourToolsView(); 
        if (currentView === 'your-work') renderYourWorkView();
    };

    const loadAndScheduleAlarms = () => {
        const now = Date.now();
        let alarmsChanged = false;
        Object.entries(activeAlarms).forEach(([alarmId, alarm]) => {
            if (!alarm || typeof alarm.nextOccurrence !== 'number' || !alarm.toolId) { delete activeAlarms[alarmId]; alarmsChanged = true; return; }
            if (alarm.triggered && alarm.frequency === 'one-time') { if (alarm.nextOccurrence < now - (7 * 24 * 60 * 60 * 1000)) { delete activeAlarms[alarmId]; alarmsChanged = true; return; } }
            if (alarm.frequency && alarm.frequency !== 'one-time' && alarm.nextOccurrence < now) {
                let nextDate = new Date(alarm.nextOccurrence);
                while (nextDate.getTime() < now) { const updatedDate = getNextOccurrence(nextDate, alarm.frequency, alarm.startTime); if (!updatedDate) { nextDate = null; break; } nextDate = updatedDate; }
                if (nextDate) { alarm.nextOccurrence = nextDate.getTime(); alarmsChanged = true; }
            }
            
            const remainingTime = alarm.nextOccurrence - now;
            if (remainingTime > 0 && !(alarm.triggered && alarm.frequency === 'one-time')) {
                setTimeout(() => triggerAlarm(alarmId), remainingTime);

                const preAlarmTime = alarm.nextOccurrence - (15 * 60 * 1000);
                if (preAlarmTime > now) {
                    const preAlarmDelay = preAlarmTime - now;
                    setTimeout(() => triggerPreAlarm(alarm.toolName), preAlarmDelay);
                }
            }
        });
        if (alarmsChanged) { userProfile ? saveDataToFirestore() : saveGuestData(); }
    };

    const createToolViewerHTML = (toolId, toolName) => {
        const saneToolName = sanitizeHTML(toolName);
        return `<div class="container">
            <div class="sub-view-header">
                <button id="back-to-tools-btn" class="btn-back" aria-label="Go back"><i class="fas fa-arrow-left"></i></button>
                <div class="reminder-controls-desktop">
                     <input type="datetime-local" id="reminderInput">
                     <select id="reminderFrequencyDesktop">
                        <option value="one-time">One time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                     </select>
                     <button id="setReminderBtn">My Work & Set Reminder</button>
                </div>
                <button class="add-event-mobile-btn" title="Add Event" aria-label="Add event or reminder"><i class="fas fa-calendar-plus"></i></button>
            </div>
            <div class="tool-viewer-content">
                <div id="loader" class="iframe-loader"></div>
                <iframe id="tool-iframe" src="/tools/${toolId}.html" title="${saneToolName}" frameborder="0" style="display:none;" onload="document.getElementById('loader').style.display='none'; this.style.display='block';"></iframe>
            </div>
        </div>`;
    };

    const showTool = (toolId, toolName, saveHistory = true) => {
        document.body.classList.add('tool-view-active'); mainContentWrapper.style.display = 'none'; toolViewerContainer.innerHTML = createToolViewerHTML(toolId, toolName); toolViewerContainer.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (saveHistory) {
            history.pushState({ toolId: toolId }, toolName, `/tool/${toolId}`);
        }
        const reminderInput = document.getElementById('reminderInput'); const setReminderBtn = document.getElementById('setReminderBtn'); const frequencySelect = document.getElementById('reminderFrequencyDesktop'); const addEventMobileBtn = document.querySelector('.add-event-mobile-btn');
        const handleReminderSet = () => {
            if (!reminderInput.value) { if (window.getComputedStyle(setReminderBtn).display !== 'none') { alert('Pick a date & time first'); } return; }
            const when = new Date(reminderInput.value); if (isNaN(when.getTime()) || when <= new Date()) { alert('Choose a future date/time'); reminderInput.value = ''; return; }
            setAlarmWithDate(toolId, toolName, when, frequencySelect.value); alert('Reminder set for ' + when.toLocaleString()); reminderInput.value = '';
        };
        if(setReminderBtn) setReminderBtn.addEventListener('click', handleReminderSet);
        if(addEventMobileBtn) { addEventMobileBtn.addEventListener('click', () => { showDatePickerModal(toolId, toolName); }); }
        if (saveHistory) addRecentTool(toolId);
    };
    const hideTool = (updateHistory = true) => { 
        if (toolViewerContainer.style.display !== 'none') { 
            document.body.classList.remove('tool-view-active'); 
            toolViewerContainer.style.display = 'none'; 
            toolViewerContainer.innerHTML = ''; 
            mainContentWrapper.style.display = 'block'; 
            if (updateHistory) {
                history.pushState({ view: currentView }, '', '/');
            }
        } 
    };
    const showCategoryTools = (categoryName) => { renderCategoryToolsView(categoryName); mainContentWrapper.style.display = 'none'; categoryToolsView.style.display = 'block'; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const hideCategoryTools = () => { if (categoryToolsView.style.display !== 'none') { categoryToolsView.style.display = 'none'; categoryToolsView.innerHTML = ''; mainContentWrapper.style.display = 'block'; } };
    
    hamburgerMenu.addEventListener('click', () => mainNav.classList.toggle('active'));
    logoLink.addEventListener('click', (e) => { e.preventDefault(); history.pushState({view: 'home'}, '', '/'); switchView('home'); });
    
    const handleDataViewClick = (e) => {
        const link = e.target.closest('a[data-view]');
        if (!link) return;

        e.preventDefault();
        const view = link.dataset.view;

        if (view === 'profile') {
            if (userProfile) {
                history.pushState({ view: 'profile' }, '', '/profile');
                switchView('profile');
            } else {
                profileSignInModal.classList.add('show');
            }
            return;
        }

        const newPath = view === 'home' ? '/' : `/${view}`;
        history.pushState({ view: view }, '', newPath);
        switchView(view);
    };

    mainNav.addEventListener('click', handleDataViewClick);

    const showModal = () => signInModal.classList.add('show'); const hideModal = () => signInModal.classList.remove('show');
    modalCloseBtn.addEventListener('click', hideModal); signInModal.addEventListener('click', (e) => { if (e.target === signInModal) hideModal(); });
    
    const guestSignInBtn = signInModal.querySelector('.google-signin-btn');
    if (guestSignInBtn) {
        guestSignInBtn.addEventListener('click', () => {
            signInModal.classList.remove('show');
            profileSignInModal.classList.add('show');
        });
    }

    profileModalCloseBtn.addEventListener('click', () => profileSignInModal.classList.remove('show'));
    profileSignInModal.addEventListener('click', (e) => {
        if (e.target === profileSignInModal) profileSignInModal.classList.remove('show');
    });
    
    const handleRouteChange = () => {
        const path = window.location.pathname;
        const toolMatch = path.match(/^\/tool\/([a-zA-Z0-9-]+)/);
        if (toolMatch) {
            const toolId = toolMatch[1];
            const tool = toolsData.find(t => t.id === toolId);
            if (tool) {
                showTool(tool.id, tool.Name, false);
            } else {
                history.replaceState({ view: 'home' }, '', '/');
                switchView('home');
            }
        } else {
            hideTool(false);
            const validViews = ['home', 'categories', 'popular', 'your-tools', 'your-work', 'profile'];
            let view = path.substring(1) || 'home';
            if (!validViews.includes(view)) {
                view = 'home';
                history.replaceState({ view: 'home' }, '', '/');
            }
            switchView(view);
        }
    };

    window.addEventListener('popstate', handleRouteChange);

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            mainHeader.classList.add('header-hidden');
        } else {
            mainHeader.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, { passive: true });

    const datePickerModal = document.getElementById('datePickerModal'); const datePickerElements = { month: document.getElementById('month-picker'), day: document.getElementById('day-picker'), year: document.getElementById('year-picker'), hour: document.getElementById('hour-picker'), minute: document.getElementById('minute-picker'), ampm: document.getElementById('ampm-picker'), frequency: document.getElementById('reminderFrequencyMobile'), set: document.getElementById('datePickerSet'), cancel: document.getElementById('datePickerCancel'), clear: document.getElementById('datePickerClear'), }; let datePickerScrollTimeout = null;
    const getSelectedItemValue = (wheel) => { const itemHeight = 50; const selected_index = Math.round(wheel.scrollTop / itemHeight); const wheelDiv = wheel.querySelector('.picker-wheel'); if (!wheelDiv || !wheelDiv.children[selected_index]) return null; return wheelDiv.children[selected_index].dataset.value; };
    const populateDays = (year, month) => {
        const previouslySelectedDay = parseInt(getSelectedItemValue(datePickerElements.day), 10) || 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate(); let dayHtml = '<div class="picker-wheel">';
        for (let i = 1; i <= daysInMonth; i++) { dayHtml += `<div class="picker-item" data-value="${i}">${i}</div>`; }
        dayHtml += '</div>'; datePickerElements.day.innerHTML = dayHtml;
        const newSelectedDay = Math.min(previouslySelectedDay, daysInMonth); datePickerElements.day.scrollTop = (newSelectedDay - 1) * 50;
    };
    const showDatePickerModal = (toolId, toolName) => {
        datePickerModal.dataset.toolId = toolId; datePickerModal.dataset.toolName = toolName;
        const now = new Date(); now.setHours(now.getHours() + 1);
        const currentYear = now.getFullYear(); const currentMonth = now.getMonth(); const currentDay = now.getDate(); let currentHour24 = now.getHours(); const currentMinute = Math.ceil(now.getMinutes() / 5) * 5 % 60; const currentAmPm = currentHour24 >= 12 ? 'PM' : 'AM'; let currentHour12 = currentHour24 % 12; if (currentHour12 === 0) currentHour12 = 12;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; let monthHtml = '<div class="picker-wheel">'; months.forEach((m, i) => monthHtml += `<div class="picker-item" data-value="${i}">${m}</div>`); monthHtml += '</div>'; datePickerElements.month.innerHTML = monthHtml;
        let yearHtml = '<div class="picker-wheel">'; for (let i = currentYear; i < currentYear + 10; i++) { yearHtml += `<div class="picker-item" data-value="${i}">${i}</div>`; } yearHtml += '</div>'; datePickerElements.year.innerHTML = yearHtml;
        populateDays(currentYear, currentMonth);
        let hourHtml = '<div class="picker-wheel">'; for (let i = 1; i <= 12; i++) { hourHtml += `<div class="picker-item" data-value="${i}">${String(i).padStart(2, '0')}</div>`; } hourHtml += '</div>'; datePickerElements.hour.innerHTML = hourHtml;
        let minuteHtml = '<div class="picker-wheel">'; for (let i = 0; i < 60; i += 5) { minuteHtml += `<div class="picker-item" data-value="${i}">${String(i).padStart(2, '0')}</div>`; } minuteHtml += '</div>'; datePickerElements.minute.innerHTML = minuteHtml;
        datePickerElements.ampm.innerHTML = `<div class="picker-wheel"><div class="picker-item" data-value="AM">AM</div><div class="picker-item" data-value="PM">PM</div></div>`;
        datePickerElements.year.scrollTop = 0; datePickerElements.month.scrollTop = currentMonth * 50; datePickerElements.day.scrollTop = (currentDay - 1) * 50; datePickerElements.hour.scrollTop = (currentHour12 - 1) * 50; datePickerElements.minute.scrollTop = (currentMinute / 5) * 50; datePickerElements.ampm.scrollTop = (currentAmPm === 'AM' ? 0 : 1) * 50;
        const handleScroll = () => { clearTimeout(datePickerScrollTimeout); datePickerScrollTimeout = setTimeout(() => { const year = parseInt(getSelectedItemValue(datePickerElements.year), 10); const month = parseInt(getSelectedItemValue(datePickerElements.month), 10); if (!isNaN(year) && !isNaN(month)) { populateDays(year, month); } }, 150); };
        datePickerElements.month.addEventListener('scroll', handleScroll); datePickerElements.year.addEventListener('scroll', handleScroll);
        datePickerModal.classList.add('show');
    };
    const hideDatePickerModal = () => datePickerModal.classList.remove('show');
    datePickerElements.set.addEventListener('click', () => {
        const { toolId, toolName } = datePickerModal.dataset; const year = parseInt(getSelectedItemValue(datePickerElements.year), 10); const month = parseInt(getSelectedItemValue(datePickerElements.month), 10); const day = parseInt(getSelectedItemValue(datePickerElements.day), 10); let hour = parseInt(getSelectedItemValue(datePickerElements.hour), 10); const minute = parseInt(getSelectedItemValue(datePickerElements.minute), 10); const ampm = getSelectedItemValue(datePickerElements.ampm); const frequency = datePickerElements.frequency.value;
        if (![year, month, day, hour, minute].some(isNaN) && ampm) {
            if (ampm === 'PM' && hour < 12) hour += 12; if (ampm === 'AM' && hour === 12) hour = 0;
            const selectedDate = new Date(year, month, day, hour, minute); setAlarmWithDate(toolId, toolName, selectedDate, frequency); alert('Reminder set for ' + selectedDate.toLocaleString()); hideDatePickerModal();
        } else { alert('An error occurred. Please try again.'); }
    });
    datePickerElements.cancel.addEventListener('click', hideDatePickerModal); datePickerModal.addEventListener('click', (e) => { if(e.target === datePickerModal) hideDatePickerModal(); });
    datePickerElements.clear.addEventListener('click', () => { if(datePickerModal.dataset.toolId && datePickerModal.dataset.toolName) { showDatePickerModal(datePickerModal.dataset.toolId, datePickerModal.dataset.toolName); } });
    
    const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; };
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim(); const safeQuery = sanitizeHTML(query);
        if (query.length === 0) {
            searchResultsView.style.display = 'none';
            if (currentView === 'home' || currentView === 'popular') {
                popularToolsSection.style.display = '';
            }
            if (currentView === 'home') {
                newToolsSection.style.display = '';
            }
            return;
        }
        popularToolsSection.style.display = 'none';
        newToolsSection.style.display = 'none';
        searchResultsView.style.display = '';
        
        if (query.length < 2) {
            searchResultsHeading.textContent = `Please type at least 2 characters...`;
            searchResultsGrid.innerHTML = '';
            return;
        }
        const filteredTools = toolsData.filter(tool => tool.Name.toLowerCase().includes(query));
        searchResultsHeading.innerHTML = `Found ${filteredTools.length} tools for "<strong>${safeQuery}</strong>"`;
        const emptyMessage = `Found 0 tools for "<strong>${safeQuery}</strong>". Please email the tool name to <a href="mailto:support@toolshub365.com">Support_Team</a>. Your requested tool will be added shortly with Name.Day to day update <a href="https://whatsapp.com/channel/0029VbBM5GhDuMRZKFJO6x14">Whatsapp_Channel</a>.<div class="idea-credit"><i class="fas fa-lightbulb"></i> Idea Share: Ayra, New York, USA</div>`;
        renderTools(searchResultsGrid, filteredTools, false, emptyMessage);
    };
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    const handleShareClick = async (button) => {
        const { toolId, toolTitle } = button.dataset; const url = `${window.location.origin}/tool/${toolId}`; const shareData = { title: `Check out: ${toolTitle}`, text: `I found a great free tool on ToolHub: ${toolTitle}`, url };
        try { await navigator.share(shareData); } catch (err) { try { await navigator.clipboard.writeText(url); const originalIcon = button.innerHTML; button.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => { button.innerHTML = originalIcon; }, 2000); } catch (err) { alert('Could not copy URL. Please copy it manually: ' + url); } }
    };

    document.body.addEventListener('click', (e) => {
        const openBtn = e.target.closest('.btn-open'); const bookmarkBtn = e.target.closest('.btn-bookmark'); const shareBtn = e.target.closest('.btn-share'); const backBtn = e.target.closest('#back-to-tools-btn'); const categoryCard = e.target.closest('.category-card'); const backToCategoriesBtn = e.target.closest('#back-to-categories-btn');
        if (openBtn) { 
            e.preventDefault();
            const { toolId, toolName } = openBtn.dataset; 
            if (toolId && toolName) showTool(toolId, toolName, true);
        }
        if (bookmarkBtn) handleBookmarkClick(bookmarkBtn); 
        if (shareBtn) handleShareClick(shareBtn);
        if (backBtn) { 
            history.back();
        }
        if (categoryCard) showCategoryTools(categoryCard.dataset.categoryName); 
        if (backToCategoriesBtn) hideCategoryTools();

        if (e.target.id === 'profile-save-btn') {
            const birthdayInput = document.getElementById('profile-birthday');
            const notificationsInput = document.getElementById('notification-toggle');
            userPreferences.birthday = birthdayInput.value;
            userPreferences.notifications = notificationsInput.checked;
            userProfile ? saveDataToFirestore() : saveGuestData();
            alert('Preferences saved!');
        }
        if (e.target.id === 'profile-sign-out-btn') {
            if (confirm('Are you sure you want to sign out?')) {
                signOut();
            }
        }

        if (currentView === 'your-work') {
            if (e.target.id === 'main-alarm-toggle') {
                userPreferences.notifications = e.target.checked;
                userProfile ? saveDataToFirestore() : saveGuestData();
            }
            if (e.target.id === 'pre-alarm-toggle') {
                userPreferences.preAlarms = e.target.checked;
                userProfile ? saveDataToFirestore() : saveGuestData();
            }

            const deleteEventBtn = e.target.closest('.delete-event-btn'); 
            const calendarEvent = e.target.closest('.calendar-event');
            if (e.target.closest('#calendar-today-btn')) { calendarDisplayDate = new Date(); renderYourWorkView(); }
            if (e.target.closest('#calendar-prev-btn')) { calendarDisplayDate.setDate(calendarDisplayDate.getDate() - 1); renderYourWorkView(); }
            if (e.target.closest('#calendar-next-btn')) { calendarDisplayDate.setDate(calendarDisplayDate.getDate() + 1); renderYourWorkView(); }
            if (deleteEventBtn) {
                e.stopPropagation(); 
                const alarmId = deleteEventBtn.dataset.alarmId; 
                const alarm = activeAlarms[alarmId]; 
                const message = (alarm && alarm.frequency !== 'one-time') ? 'Are you sure you want to delete this recurring reminder and all its future occurrences?' : 'Are you sure you want to delete this reminder?';
                if (alarmId && confirm(message)) { delete activeAlarms[alarmId]; userProfile ? saveDataToFirestore() : saveGuestData(); updateYourWorkBadge(); renderYourWorkView(); }
            } else if (calendarEvent && !calendarEvent.classList.contains('is-completed')) { 
                const { toolId, toolName } = calendarEvent.dataset; 
                if (toolId && toolName) showTool(toolId, toolName, true); 
            }
        }
    });

    async function initializeApp(data) {
        toolsData = data;
        loadGuestData(); // Load guest data by default
        
        const shuffledTools = [...data].sort(() => 0.5 - Math.random());
        const numPopular = 18;
        const numNew = 18;
        const popularTools = shuffledTools.slice(0, numPopular);
        const newTools = shuffledTools.slice(-numNew);
        renderTools(popularGrid, popularTools);
        renderTools(newGrid, newTools.reverse());
        document.getElementById('copyright-year').textContent = new Date().getFullYear();
        
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            popularTools.slice(0, 10).forEach(tool => {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = `/tools/${tool.id}.html`;
              document.head.appendChild(link);
            });
          });
        }
        handleRouteChange();
    }
    
    const bannerRotator = document.getElementById('mobile-top-banner-ad-rotator');
    if (bannerRotator) {
        const banners = bannerRotator.querySelectorAll('.banner-link-wrapper');
        if (banners.length > 1) {
            let currentIndex = 0;
            const rotateBanners = () => { 
                banners[currentIndex].classList.remove('active'); 
                currentIndex = (currentIndex + 1) % banners.length; 
                banners[currentIndex].classList.add('active'); 
            };
            setInterval(rotateBanners, 4000);
        }
    }
    
    async function loadData() { 
        try { 
            const response = await fetch(`/tools.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); 
            initializeApp(await response.json()); 
        } catch (error) { 
            console.error("Failed to load tools data:", error);
            if(popularGrid) popularGrid.innerHTML = `<p style="text-align: center; padding: 2rem;">Could not load tools. Please try again later.</p>`;
            if(newGrid) newGrid.innerHTML = '';
        } 
    }
    loadData();
});
