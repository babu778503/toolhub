document.addEventListener('DOMContentLoaded', () => {
    let toolsData = [];
    const toolsData_fallback = [
      { "id": "App-Usage-Monitor", "Name": "App Usage Monitor", "Category": "Utility" },
      { "id": "Asthma-Trigger-Monitor", "Name": "Asthma Trigger Monitor", "Category": "Health" },
      { "id": "Auto-Renewal-Alert", "Name": "Auto Renewal Alert", "Category": "Financial" },
      { "id": "Baby-Growth-Tracker", "Name": "Baby Growth Tracker", "Category": "Health" },
      { "id": "Bac-Blood-Alcohol-Estimator", "Name": "Bac (Blood Alcohol) Estimator", "Category": "Health" },
      { "id": "Backpack-Weight-Calculator", "Name": "Backpack Weight Calculator", "Category": "Lifestyle" },
      { "id": "Baking-Temperature-Converter", "Name": "Baking Temperature Converter", "Category": "Utility" },
      { "id": "Battery-Health-Monitor", "Name": "Battery Health Monitor", "Category": "Utility" },
      { "id": "Battery-Replacement-Tracker", "Name": "Battery Replacement Tracker", "Category": "Utility" },
      { "id": "Beard-Trimming-Timer", "Name": "Beard Trimming Timer", "Category": "Lifestyle" },
      { "id": "Belt-Size-Finder", "Name": "Belt Size Finder", "Category": "Lifestyle" },
      { "id": "Bike-Route-Planner", "Name": "Bike Route Planner", "Category": "Fitness" },
      { "id": "Bike-Share-Availability-Checker", "Name": "Bike Share Availability Checker", "Category": "Utility" },
      { "id": "Birthday-Reminder", "Name": "Birthday Reminder", "Category": "Lifestyle" },
      { "id": "Blood-Pressure-Monitor", "Name": "Blood Pressure Monitor", "Category": "Health" },
      { "id": "Blue-Light-Exposure-Monitor", "Name": "Blue Light Exposure Monitor", "Category": "Health" },
      { "id": "Body-Measurement-Tracker", "Name": "Body Measurement Tracker", "Category": "Health" },
      { "id": "Boiling-Water-Timer", "Name": "Boiling Water Timer", "Category": "Utility" },
      { "id": "Book-Page-Counter", "Name": "Book Page Counter", "Category": "Education" },
      { "id": "Break-Even-Calculator", "Name": "Break Even Calculator", "Category": "Financial" },
      { "id": "Breathing-Exercise-Timer", "Name": "Breathing Exercise Timer", "Category": "Health" },
      { "id": "Bucket-List-Organizer", "Name": "Bucket List Organizer", "Category": "Lifestyle" },
      { "id": "Budget-Planner", "Name": "Budget Planner", "Category": "Financial" },
      { "id": "Caffeine-Intake-Tracker", "Name": "Caffeine Intake Tracker", "Category": "Health" },
      { "id": "Call-Duration-Tracker", "Name": "Call Duration Tracker", "Category": "Utility" },
      { "id": "Calorie-Counter", "Name": "Calorie Counter", "Category": "Health" },
      { "id": "Calorie-Intake-Calculator", "Name": "Calorie Intake Calculator", "Category": "Health" },
      { "id": "Camping-Gear-Checklist", "Name": "Camping Gear Checklist", "Category": "Lifestyle" },
      { "id": "Carb-Counter", "Name": "Carb Counter", "Category": "Health" },
      { "id": "Carb-Cycling-Planner", "Name": "Carb Cycling Planner", "Category": "Fitness" },
      { "id": "Carbon-Footprint-Calculator", "Name": "Carbon Footprint Calculator", "Category": "Environment" },
      { "id": "Carbon-Offset-Estimator", "Name": "Carbon Offset Estimator", "Category": "Environment" },
      { "id": "Car-Insurance-Cost-Checker", "Name": "Car Insurance Cost Checker", "Category": "Financial" },
      { "id": "Car-Loan-Calculator", "Name": "Car Loan Calculator", "Category": "Financial" },
      { "id": "Car-Maintenance-Reminder", "Name": "Car Maintenance Reminder", "Category": "Utility" },
      { "id": "Car-Rental-Cost-Calculator", "Name": "Car Rental Cost Calculator", "Category": "Financial" },
      { "id": "Car-Wash-Reminder", "Name": "Car Wash Reminder", "Category": "Utility" },
      { "id": "Cashback-Estimator", "Name": "Cashback Estimator", "Category": "Financial" },
      { "id": "Catering-Portion-Calculator", "Name": "Catering Portion Calculator", "Category": "Lifestyle" },
      { "id": "Cholesterol-Level-Checker", "Name": "Cholesterol Level Checker", "Category": "Health" },
      { "id": "Clothing-Size-Converter", "Name": "Clothing Size Converter", "Category": "Lifestyle" },
      { "id": "Cloud-Storage-Usage-Monitor", "Name": "Cloud Storage Usage Monitor", "Category": "Utility" },
      { "id": "Coffee-Brewing-Timer", "Name": "Coffee Brewing Timer", "Category": "Lifestyle" },
      { "id": "Ac-Filter-Replacement-Reminder", "Name": "Ac Filter Replacement Reminder", "Category": "Utility" },
      { "id": "Air-Quality-Checker", "Name": "Air Quality Checker", "Category": "Environment" },
      { "id": "Alcohol-Unit-Calculator", "Name": "Alcohol Unit Calculator", "Category": "Health" },
      { "id": "Allergy-Forecast-Checker", "Name": "Allergy Forecast Checker", "Category": "Health" },
      { "id": "Allergy-Free-Recipe-Converter", "Name": "Allergy Free Recipe Converter", "Category": "Health" },
      { "id": "Anniversary-Tracker", "Name": "Anniversary Tracker", "Category": "Lifestyle" },
      { "id": "Appliance-Energy-Cost-Calculator", "Name": "Appliance Energy Cost Calculator", "Category": "Utility" },
      { "id": "Dry-Cleaning-Tracker", "Name": "Dry Cleaning Tracker", "Category": "Daily" },
      { "id": "Egg-Boiling-Timer", "Name": "Egg Boiling Timer", "Category": "Daily" },
      { "id": "Daily-Water-Intake-Tracker", "Name": "Daily Water Intake Tracker", "Category": "Daily" }
    ];
    
    // --- 🎨 IN-GRID "AYRA SIMIN AYMA" ADS (EDITABLE) 🎨 ---
    const svgAdIcon = `<svg width="32" height="32" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cardGradient" x1="2" y1="25" x2="40" y2="25" gradientUnits="userSpaceOnUse"><stop stop-color="#F47B56"/><stop offset="0.6" stop-color="#E15299"/><stop offset="1" stop-color="#8E63F5"/></linearGradient></defs><rect x="2" y="14" width="38" height="22" rx="2" fill="url(#cardGradient)"/><rect x="2" y="19" width="38" height="2.5" fill="#3C2F84"/><rect x="2" y="27" width="38" height="2.5" fill="#3C2F84"/><rect x="19" y="14" width="4" height="22" fill="#FDC04C"/><path d="M19 14C15 14 14 7 19 7" stroke="#FDC04C" stroke-width="4" stroke-linecap="round"/><path d="M23 14C27 14 28 7 23 7" stroke="#FDC04C" stroke-width="4" stroke-linecap="round"/></svg>`;
    const inGridAdsData = [
        { id: 'in-grid-ad-1-trophy', icon: '🏆', line1: 'Ayra Simin', line2: 'Ayma #1', buttonText: 'Try Now', link: 'your-posting-area-link-1' },
        { id: 'in-grid-ad-2-money', icon: '💰', line1: 'Ayra Simin', line2: 'Ayma #2', buttonText: 'Get Offer', link: 'your-posting-area-link-2' },
        { id: 'in-grid-ad-3-gift', icon: '🎁', line1: 'Ayra Simin', line2: 'Ayma #3', buttonText: 'Learn More', link: 'your-posting-area-link-3' },
        { id: 'in-grid-ad-4-card', icon: svgAdIcon, line1: 'Ayra Simin', line2: 'Ayma #4', buttonText: 'Sign Up', link: 'your-posting-area-link-4' }
    ];
    const createNewInGridAdCardHTML = (adData) => `
        <a id="${adData.id}" href="${adData.link}" class="ad-link-wrapper" target="_blank">
            <div class="ad-card">
                <div class="celebration-bg"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                <div class="ad-content">
                    <div class="ad-icon">${adData.icon}</div>
                    <div class="ad-text">
                        <span class="ad-text-line">${adData.line1}</span>
                        <span class="ad-text-line">${adData.line2}</span>
                    </div>
                </div>
                <button class="ad-button">${adData.buttonText}</button>
            </div>
        </a>
    `;
    // --- END IN-GRID ADS ---

    // --- 🎓 SINGLE TOOL VIEW BANNER ADS (EDITABLE) 🎓 ---
    const singleToolBannerAds = {
        desktop: [
            { id: 'tool-banner-ad-1-kourse', link: 'your-posting-area-link-here', icon: 'fa-graduation-cap', title: 'Master a New Skill', text: 'Join Kourse for interactive coding courses. Learn Python, JS, and more.', cta: 'Start Learning' },
            { id: 'tool-banner-ad-2-taskflow', link: 'your-posting-area-link-here', icon: 'fa-tasks', title: 'Stay Organized', text: 'Try \'TaskFlow Pro\' for seamless project management.', cta: 'Get Started' },
            { id: 'tool-banner-ad-3-vpn', link: 'your-posting-area-link-here', icon: 'fa-shield-alt', title: 'Secure Your Digital Life', text: 'Get \'PrivacyGuard VPN\' with 50% off your first year.', cta: 'Protect My PC' }
        ],
        mobile: { id: 'tool-banner-ad-mobile', link: 'your-posting-area-link-here', icon: 'fa-rocket', title: 'Level Up On The Go!', text: 'Kourse mobile courses are now live. Learn anywhere, anytime.', cta: 'Browse Courses' }
    };
    // --- END SINGLE TOOL VIEW ADS ---

    const mainContentWrapper = document.getElementById('main-content-wrapper');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a[data-view]');
    const footerLinks = document.querySelectorAll('.footer-links-bottom a[data-view]');
    const logoLink = document.querySelector('.logo');
    const signInModal = document.getElementById('signInModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    const popularGrid = document.getElementById('popular-tools-grid');
    const newGrid = document.getElementById('new-tools-grid');
    const promoAdGrid = document.getElementById('promo-ad-grid');
    const promoAdsSection = document.getElementById('promo-ads-section');
    const toolViewerContainer = document.getElementById('tool-viewer-container');
    const toolViewerAdsContainer = document.getElementById('tool-viewer-ads-container');
    const categoryToolsView = document.getElementById('category-tools-view');
    const categoryToolsAdsContainer = document.getElementById('category-tools-ads-container');
    const allPageSections = document.querySelectorAll('.page-section');
    const categoriesView = document.getElementById('categories-view');
    const yourToolsView = document.getElementById('your-tools-view');
    const yourWorkView = document.getElementById('your-work-view');
    const privacyPolicyView = document.getElementById('privacy-policy-view');
    const termsOfServiceView = document.getElementById('terms-of-service-view');
    const aboutUsView = document.getElementById('about-us-view');
    const contactUsView = document.getElementById('contact-us-view');
    const disclaimerView = document.getElementById('disclaimer-view');
    const cookiePolicyView = document.getElementById('cookie-policy-view');
    const dmcaPolicyView = document.getElementById('dmca-policy-view');
    const faqView = document.getElementById('faq-view');
    const advertiseView = document.getElementById('advertise-view');
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
    let bookmarks = JSON.parse(localStorage.getItem('toolHubBookmarks')) || [];
    let recentlyUsed = JSON.parse(localStorage.getItem('toolHubRecent')) || [];
    let activeAlarms = {};
    const GUEST_BOOKMARK_LIMIT = 20;
    const RECENTLY_USED_LIMIT = 100;

    const sanitizeHTML = (str) => { if (!str) return ''; const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; };
    const unlockAudio = () => { alarmSound.play().catch(() => {}); alarmSound.pause(); alarmSound.currentTime = 0; };
    document.body.addEventListener('click', unlockAudio, { once: true });
    const saveBookmarks = () => localStorage.setItem('toolHubBookmarks', JSON.stringify(bookmarks));
    const saveRecentlyUsed = () => localStorage.setItem('toolHubRecent', JSON.stringify(recentlyUsed));
    const saveAlarms = () => localStorage.setItem('toolHubAlarms', JSON.stringify(activeAlarms));

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
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        let todayRemindersCount = 0;
        Object.values(activeAlarms).forEach(alarm => {
            if (alarm.triggered && alarm.frequency === 'one-time') return;
            const alarmStartDate = new Date(alarm.startTime);
            if (alarmStartDate > todayEnd) return;
            if (alarm.frequency === 'one-time') {
                if (alarm.nextOccurrence >= todayStart.getTime() && alarm.nextOccurrence < todayEnd.getTime()) { todayRemindersCount++; }
            } else {
                let occurrence = new Date(alarm.startTime);
                if (occurrence < todayStart) {
                    switch (alarm.frequency) {
                        case 'daily': occurrence = new Date(todayStart.getTime()); occurrence.setHours(alarmStartDate.getHours(), alarmStartDate.getMinutes(), alarmStartDate.getSeconds()); break;
                        case 'weekly': const daysUntil = (alarmStartDate.getDay() - todayStart.getDay() + 7) % 7; occurrence = new Date(todayStart.getTime() + daysUntil * 24 * 60 * 60 * 1000); occurrence.setHours(alarmStartDate.getHours(), alarmStartDate.getMinutes(), alarmStartDate.getSeconds()); break;
                        case 'monthly': occurrence = new Date(todayStart); occurrence.setDate(alarmStartDate.getDate()); occurrence.setHours(alarmStartDate.getHours(), alarmStartDate.getMinutes(), alarmStartDate.getSeconds()); if(occurrence < todayStart) occurrence.setMonth(occurrence.getMonth()+1); break;
                        case 'yearly': occurrence = new Date(todayStart.getFullYear(), alarmStartDate.getMonth(), alarmStartDate.getDate()); occurrence.setHours(alarmStartDate.getHours(), alarmStartDate.getMinutes(), alarmStartDate.getSeconds()); if (occurrence < todayStart) occurrence.setFullYear(occurrence.getFullYear() + 1); break;
                    }
                }
                if (occurrence.getTime() >= todayStart.getTime() && occurrence.getTime() < todayEnd.getTime()) { todayRemindersCount++; }
            }
        });
        badge.textContent = todayRemindersCount > 0 ? todayRemindersCount : '';
    };
    const isBookmarked = (toolId) => bookmarks.includes(toolId);
    const addRecentTool = (toolId) => {
        recentlyUsed = recentlyUsed.filter(item => item.id !== toolId);
        recentlyUsed.unshift({ id: toolId, timestamp: Date.now() });
        if (recentlyUsed.length > RECENTLY_USED_LIMIT) { recentlyUsed.pop(); }
        saveRecentlyUsed();
    };
    const createToolCardHTML = (tool, isYourToolsView = false) => {
        const bookmarkedClass = isBookmarked(tool.id) ? 'bookmarked' : '';
        const hasAlarm = isYourToolsView && Object.values(activeAlarms).some(alarm => alarm.toolId === tool.id && !alarm.triggered);
        const alarmIconHTML = hasAlarm ? `<i class="fas fa-bell" style="color: #f59e0b; margin-left: 8px;" title="Alarm is set for this tool"></i>` : '';
        return `<div class="tool-card" data-tool-id="${tool.id}"><h3 class="tool-title">${sanitizeHTML(tool.Name)}${alarmIconHTML}</h3><div class="tool-actions-bar"><a href="#" class="action-btn btn-open" data-tool-id="${tool.id}" data-tool-name="${tool.Name}">Open</a><button class="action-btn btn-bookmark ${bookmarkedClass}" data-tool-id="${tool.id}"><i class="fas fa-bookmark"></i></button><button class="action-btn btn-share" data-tool-id="${tool.id}" data-tool-title="${tool.Name}"><i class="fas fa-share-alt"></i></button></div></div>`;
    };
    
    const renderTools = (container, tools, injectAds = false, emptyMessage = "", isYourToolsView = false) => {
        if (!container) return;
        if (tools.length === 0) {
            if (emptyMessage) container.innerHTML = `<div class="empty-state-message">${emptyMessage}</div>`;
            return;
        }
        let htmlElements = tools.map(tool => createToolCardHTML(tool, isYourToolsView));
        if (injectAds && tools.length > 0) {
            const numAdsToInsert = Math.max(1, Math.floor(tools.length / 5));
            let adCounter = 0;
            for (let i = 0; i < numAdsToInsert; i++) {
                const adData = inGridAdsData[adCounter % inGridAdsData.length];
                const adHtml = createNewInGridAdCardHTML(adData);
                adCounter++;
                let randomIndex;
                do { randomIndex = Math.floor(Math.random() * (htmlElements.length + 1)); } while (htmlElements[randomIndex] && htmlElements[randomIndex].includes('ad-link-wrapper'));
                htmlElements.splice(randomIndex, 0, adHtml);
            }
        }
        container.innerHTML = htmlElements.join('');
    };

    const renderCategoriesView = () => { const categories = [...new Set(toolsData.map(tool => tool.Category))].sort(); categoriesView.innerHTML = `<div class="container"><h2><i class="fas fa-list" style="color:#6366f1;"></i> All Categories</h2><div class="category-grid">${categories.map(cat => `<div class="category-card" data-category-name="${sanitizeHTML(cat)}">${sanitizeHTML(cat)}</div>`).join('')}</div></div>`; };
    const renderYourToolsView = () => { const bookmarkedTools = toolsData.filter(tool => bookmarks.includes(tool.id)); const gridId = 'your-tools-grid'; yourToolsView.innerHTML = `<div class="container"><h2><i class="fas fa-bookmark" style="color:#ef4444;"></i> My Tools</h2><div class="tool-grid" id="${gridId}"></div></div>`; renderTools(document.getElementById(gridId), bookmarkedTools, false, 'You have no bookmarked tools yet.', true); };
    const renderCategoryToolsView = (categoryName) => { const filteredTools = toolsData.filter(tool => tool.Category === categoryName); const gridId = 'category-tools-grid'; categoryToolsView.innerHTML = `<div class="container"><div class="sub-view-header"><button id="back-to-categories-btn" class="btn-back"><i class="fas fa-arrow-left"></i></button><h2>${sanitizeHTML(categoryName)} Tools</h2></div><div class="tool-grid" id="${gridId}"></div></div>`; renderTools(document.getElementById(gridId), filteredTools, false); };
    const renderYourWorkView = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayOfWeek = calendarDisplayDate.getDay();
        const startOfWeek = new Date(calendarDisplayDate);
        startOfWeek.setDate(calendarDisplayDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        endOfWeek.setSeconds(endOfWeek.getSeconds() -1);

        const formatRange = (start, end) => { const options = { month: 'short', day: 'numeric' }; return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, {...options, year: 'numeric'})}`; }
        
        const allEvents = [];
        Object.entries(activeAlarms).forEach(([alarmId, alarm]) => {
            if (alarm.triggered && alarm.frequency === 'one-time') return;
            let occurrence = new Date(alarm.startTime);
            if (occurrence > endOfWeek) return;
            while (occurrence <= endOfWeek) {
                if (occurrence >= startOfWeek) { allEvents.push({ alarmId, date: new Date(occurrence), name: alarm.toolName, toolId: alarm.toolId, isCompleted: occurrence.getTime() < now.getTime() }); }
                if (alarm.frequency === 'one-time') break;
                occurrence = getNextOccurrence(occurrence, alarm.frequency, alarm.startTime);
                if (!occurrence) break;
            }
        });
        let calendarHtml = '';
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayDate = day.getDate();
            const dayName = day.toLocaleDateString(undefined, { weekday: 'short' });
            const fullDateStr = day.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const isTodayClass = day.getTime() === today.getTime() ? 'is-today' : '';
            const isActiveDateClass = day.getTime() === new Date(calendarDisplayDate.getFullYear(), calendarDisplayDate.getMonth(), calendarDisplayDate.getDate()).getTime() ? 'is-active-date' : '';
            const eventsForDay = allEvents.filter(event => event.date.getFullYear() === day.getFullYear() && event.date.getMonth() === day.getMonth() && event.date.getDate() === day.getDate()).sort((a,b) => a.date - b.date);
            const isEmptyClass = eventsForDay.length === 0 ? 'is-empty' : '';
            let eventsHtml = eventsForDay.map(event => `<div class="calendar-event ${event.isCompleted ? 'is-completed' : ''}" data-tool-id="${event.toolId}" data-tool-name="${event.name}" title="${sanitizeHTML(event.name)}"><span class="event-text-wrapper">${sanitizeHTML(event.name)}</span><button class="delete-event-btn" data-alarm-id="${event.alarmId}">&times;</button></div>`).join('');
            calendarHtml += `<div class="calendar-day ${isTodayClass} ${isActiveDateClass} ${isEmptyClass}"><div class="mobile-event-sidebar"><span>My Work (task)</span></div><div class="mobile-event-main-content"><div class="calendar-day-full-date">${fullDateStr}</div><div class="calendar-day-header"><span class="day-name">${dayName}</span><span class="day-number">${dayDate}</span></div><div class="calendar-events-container">${eventsHtml}</div></div></div>`;
        }
        yourWorkView.innerHTML = `<div class="container"><h2><i class="fas fa-briefcase" style="color:#7c3aed;"></i> My Work</h2><div class="your-work-controls"><button id="calendar-today-btn">Today</button><button id="calendar-prev-btn"><i class="fas fa-chevron-left"></i></button><button id="calendar-next-btn"><i class="fas fa-chevron-right"></i></button><span class="your-work-date-range">${formatRange(startOfWeek, new Date(endOfWeek.getTime() - 24*60*60*1000))}</span></div><div class="calendar-container"><div class="calendar-grid">${calendarHtml}</div></div></div>`;
    };
    const switchView = (view) => {
        if (currentView !== view) { previousView = currentView; }
        currentView = view;
        window.scrollTo({ top: 0, behavior: 'auto' });
        navLinks.forEach(link => { link.classList.toggle('active', ['home', 'categories', 'popular', 'your-tools', 'your-work'].includes(view) && link.dataset.view === view); });
        allPageSections.forEach(section => { section.style.display = section.dataset.viewGroup.includes(view) ? '' : 'none'; });
        if (searchInput.value !== '') { searchInput.value = ''; searchInput.dispatchEvent(new Event('input')); }
        hideTool(); hideCategoryTools();
        if (view === 'categories' && !categoriesView.innerHTML) renderCategoriesView();
        if (view === 'your-tools') renderYourToolsView();
        if (view === 'your-work') renderYourWorkView();
        if (mainNav.classList.contains('active')) mainNav.classList.remove('active');
    };
    const triggerAlarm = (alarmId) => {
        const alarmData = activeAlarms[alarmId]; if (!alarmData) return;
        if (alarmSound) { alarmSound.play().catch(e => console.error("Error playing sound:", e)); }
        if (Notification.permission === 'granted') { new Notification('ToolHub Reminder', { body: `Your reminder for "${alarmData.toolName}" is now!`, icon: 'https://img.icons8.com/plasticine/100/000000/alarm-clock.png' }); }
        if (alarmData.frequency === 'one-time') { alarmData.triggered = true; } else {
            const nextDate = getNextOccurrence(new Date(alarmData.nextOccurrence), alarmData.frequency, alarmData.startTime);
            if (nextDate) { alarmData.nextOccurrence = nextDate.getTime(); const delay = alarmData.nextOccurrence - Date.now(); if (delay > 0) { setTimeout(() => triggerAlarm(alarmId), delay); } } else { alarmData.triggered = true; }
        }
        saveAlarms(); updateYourWorkBadge();
        if (currentView === 'your-tools') renderYourToolsView();
        if (currentView === 'your-work') renderYourWorkView();
    };
    const setAlarmWithDate = (toolId, toolName, scheduledDate, frequency) => {
        const scheduledTime = scheduledDate.getTime();
        if (isNaN(scheduledTime) || scheduledTime <= Date.now()) { alert("Invalid date. The date must be in the future."); return; }
        const alarmId = `${toolId}-${scheduledTime}-${Math.random().toString(36).substr(2, 5)}`;
        activeAlarms[alarmId] = { startTime: scheduledTime, nextOccurrence: scheduledTime, toolName, toolId, frequency: frequency || 'one-time', triggered: false };
        saveAlarms(); updateYourWorkBadge();
        setTimeout(() => triggerAlarm(alarmId), scheduledTime - Date.now());
        if (currentView === 'your-tools') renderYourToolsView(); if (currentView === 'your-work') { calendarDisplayDate = new Date(scheduledTime); renderYourWorkView(); }
    };
    const loadAndScheduleAlarms = () => {
        const storedAlarms = JSON.parse(localStorage.getItem('toolHubAlarms')) || {};
        const now = Date.now();
        let alarmsChanged = false;
        Object.entries(storedAlarms).forEach(([alarmId, alarm]) => {
            if (!alarm || typeof alarm.nextOccurrence !== 'number' || !alarm.toolId) { delete storedAlarms[alarmId]; alarmsChanged = true; return; }
            if (alarm.triggered && alarm.frequency === 'one-time') { if (alarm.nextOccurrence < now - (7 * 24 * 60 * 60 * 1000)) { delete storedAlarms[alarmId]; alarmsChanged = true; return; } }
            if (alarm.frequency && alarm.frequency !== 'one-time' && alarm.nextOccurrence < now) {
                let nextDate = new Date(alarm.nextOccurrence);
                while (nextDate.getTime() < now) { const updatedDate = getNextOccurrence(nextDate, alarm.frequency, alarm.startTime); if (!updatedDate) { nextDate = null; break; } nextDate = updatedDate; }
                if (nextDate) { alarm.nextOccurrence = nextDate.getTime(); alarmsChanged = true; }
            }
            const remainingTime = alarm.nextOccurrence - now;
            if (remainingTime > 0 && !(alarm.triggered && alarm.frequency === 'one-time')) { setTimeout(() => triggerAlarm(alarmId), remainingTime); }
        });
        activeAlarms = storedAlarms;
        if (alarmsChanged) { saveAlarms(); }
    };

    const renderSingleToolAds = () => {
        const container = document.getElementById('single-tool-ads-container'); if (!container) return;
        const desktopAdsHTML = singleToolBannerAds.desktop.map(ad => `<a id="${ad.id}" href="${ad.link}" class="banner-ad-card" target="_blank"><i class="fas ${ad.icon} banner-ad-icon"></i><div class="banner-ad-content"><h3>${ad.title}</h3><p>${ad.text}</p></div><span class="btn-cta">${ad.cta}</span></a>`).join('');
        const mobileAd = singleToolBannerAds.mobile; const mobileAdHTML = `<a id="${mobileAd.id}" href="${mobileAd.link}" class="banner-ad-card" target="_blank"><i class="fas ${mobileAd.icon} banner-ad-icon"></i><div class="banner-ad-content"><h3>${mobileAd.title}</h3><p>${mobileAd.text}</p></div><span class="btn-cta">${mobileAd.cta}</span></a>`;
        container.innerHTML = `<div class="container"><div class="banner-ad-grid-desktop">${desktopAdsHTML}</div><div class="banner-ad-mobile">${mobileAdHTML}</div></div>`;
    };

    const createToolViewerHTML = (toolId, toolName) => {
        const saneToolName = sanitizeHTML(toolName);
        return `<div class="container"><div class="sub-view-header"><button id="back-to-tools-btn" class="btn-back"><i class="fas fa-arrow-left"></i></button><h2>${saneToolName}</h2><button class="add-event-mobile-btn" title="Add Event"><i class="fas fa-calendar-plus"></i></button></div><div class="reminder-controls-desktop"><input type="datetime-local" id="reminderInput"><select id="reminderFrequencyDesktop"><option value="one-time">One time</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select><button id="setReminderBtn" class="blinking-reminder-btn">My Work & Set Reminder</button></div><div class="tool-viewer-content"><iframe id="tool-iframe" src="/tools/${toolId}.html" title="${saneToolName}" frameborder="0"></iframe></div><div id="single-tool-ads-container"></div></div>`;
    };
    const showTool = (toolId, toolName, saveHistory = true) => {
        document.body.classList.add('tool-view-active'); mainContentWrapper.style.display = 'none'; toolViewerContainer.innerHTML = createToolViewerHTML(toolId, toolName); toolViewerContainer.style.display = 'block';
        renderSingleToolAds();
        if (promoAdsSection) { toolViewerAdsContainer.innerHTML = promoAdsSection.outerHTML; toolViewerAdsContainer.style.display = 'block'; }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const reminderInput = document.getElementById('reminderInput'); const setReminderBtn = document.getElementById('setReminderBtn'); const frequencySelect = document.getElementById('reminderFrequencyDesktop'); const addEventMobileBtn = document.querySelector('.add-event-mobile-btn');
        const handleReminderSet = () => {
            if (!reminderInput.value) { if (window.getComputedStyle(setReminderBtn).display !== 'none') { alert('Pick a date & time first'); } return; }
            const when = new Date(reminderInput.value); if (isNaN(when.getTime()) || when <= new Date()) { alert('Choose a future date/time'); reminderInput.value = ''; return; }
            setAlarmWithDate(toolId, toolName, when, frequencySelect.value); alert('Reminder set for ' + when.toLocaleString()); reminderInput.value = '';
        };
        setReminderBtn.addEventListener('click', handleReminderSet);
        if(addEventMobileBtn) { addEventMobileBtn.addEventListener('click', () => { showDatePickerModal(toolId, toolName); }); }
        if (saveHistory) addRecentTool(toolId);
    };
    const hideTool = () => { if (toolViewerContainer.style.display !== 'none') { document.body.classList.remove('tool-view-active'); toolViewerContainer.style.display = 'none'; toolViewerContainer.innerHTML = ''; toolViewerAdsContainer.style.display = 'none'; toolViewerAdsContainer.innerHTML = ''; mainContentWrapper.style.display = 'block'; } };
    const showCategoryTools = (categoryName) => { renderCategoryToolsView(categoryName); mainContentWrapper.style.display = 'none'; categoryToolsView.style.display = 'block'; if (promoAdsSection) { categoryToolsAdsContainer.innerHTML = promoAdsSection.outerHTML; categoryToolsAdsContainer.style.display = 'block'; } window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const hideCategoryTools = () => { if (categoryToolsView.style.display !== 'none') { categoryToolsView.style.display = 'none'; categoryToolsView.innerHTML = ''; categoryToolsAdsContainer.style.display = 'none'; categoryToolsAdsContainer.innerHTML = ''; mainContentWrapper.style.display = 'block'; } };
    hamburgerMenu.addEventListener('click', () => mainNav.classList.toggle('active'));
    logoLink.addEventListener('click', (e) => { e.preventDefault(); switchView('home'); });
    
    const handleDataViewClick = (e) => { const link = e.target.closest('a[data-view]'); if (link) { e.preventDefault(); switchView(link.dataset.view); } };
    mainNav.addEventListener('click', handleDataViewClick);
    footerLinks.forEach(link => link.addEventListener('click', handleDataViewClick));

    const showModal = () => signInModal.classList.add('show'); const hideModal = () => signInModal.classList.remove('show');
    modalCloseBtn.addEventListener('click', hideModal); signInModal.addEventListener('click', (e) => { if (e.target === signInModal) hideModal(); });

    // --- Custom Date Picker Logic ---
    const datePickerModal = document.getElementById('datePickerModal'); 
    const datePickerElements = { 
        month: document.getElementById('month-picker'), 
        day: document.getElementById('day-picker'), 
        year: document.getElementById('year-picker'), 
        hour: document.getElementById('hour-picker'), 
        minute: document.getElementById('minute-picker'), 
        ampm: document.getElementById('ampm-picker'), 
        frequency: document.getElementById('reminderFrequencyMobile'), 
        set: document.getElementById('datePickerSet'), 
        cancel: document.getElementById('datePickerCancel'), 
        clear: document.getElementById('datePickerClear'), 
    }; 
    let datePickerScrollTimeout = null;
    const getSelectedItemValue = (wheel) => { 
        if (!wheel) return null;
        const itemHeight = 50; 
        const selected_index = Math.round(wheel.scrollTop / itemHeight); 
        const wheelDiv = wheel.querySelector('.picker-wheel'); 
        if (!wheelDiv || !wheelDiv.children[selected_index]) return null; 
        return wheelDiv.children[selected_index].dataset.value; 
    };
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
    // --- End Custom Date Picker Logic ---
    
    const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; };
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim(); const safeQuery = sanitizeHTML(query);
        if (query.length === 0) { searchResultsView.style.display = 'none'; if (currentView === 'home' || currentView === 'popular') popularToolsSection.style.display = ''; if (currentView === 'home') newToolsSection.style.display = ''; return; }
        popularToolsSection.style.display = 'none'; newToolsSection.style.display = 'none'; searchResultsView.style.display = '';
        if (query.length < 2) { searchResultsHeading.textContent = `Please type at least 2 characters...`; searchResultsGrid.innerHTML = ''; return; }
        const filteredTools = toolsData.filter(tool => tool.Name.toLowerCase().includes(query)); searchResultsHeading.innerHTML = `Found ${filteredTools.length} tools for "<strong>${safeQuery}</strong>"`;
        const emptyMessage = `Found 0 tools for "<strong>${safeQuery}</strong>". Please email the tool name to <a href="mailto:aktar.babu@gmail.com">aktar.babu@gmail.com</a>. Your requested tool will be added shortly with Name.<div class="idea-credit"><i class="fas fa-lightbulb"></i> Idea Share: Ayra, New York, USA</div>`;
        renderTools(searchResultsGrid, filteredTools, false, emptyMessage);
    };
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    const handleBookmarkClick = (button) => {
        const toolId = button.dataset.toolId; if (!toolId) return;
        if (isBookmarked(toolId)) { bookmarks = bookmarks.filter(id => id !== toolId); button.classList.remove('bookmarked'); } else { if (bookmarks.length >= GUEST_BOOKMARK_LIMIT) { showModal(); return; } bookmarks.push(toolId); button.classList.add('bookmarked'); }
        saveBookmarks(); if (currentView === 'your-tools') renderYourToolsView();
    };
    const handleShareClick = async (button) => {
        const { toolId, toolTitle } = button.dataset; const url = `${window.location.origin}/tools/${toolId}.html`; const shareData = { title: `Check out: ${toolTitle}`, text: `I found a great free tool on ToolHub: ${toolTitle}`, url };
        try { await navigator.share(shareData); } catch (err) { try { await navigator.clipboard.writeText(url); const originalIcon = button.innerHTML; button.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => { button.innerHTML = originalIcon; }, 2000); } catch (err) { alert('Could not copy URL. Please copy it manually: ' + url); } }
    };
    document.body.addEventListener('click', (e) => {
        const openBtn = e.target.closest('.btn-open'); const bookmarkBtn = e.target.closest('.btn-bookmark'); const shareBtn = e.target.closest('.btn-share'); const backBtn = e.target.closest('#back-to-tools-btn'); const categoryCard = e.target.closest('.category-card'); const backToCategoriesBtn = e.target.closest('#back-to-categories-btn');
        const backFromPrivacyBtn = e.target.closest('#back-from-privacy-btn'); const backFromTermsBtn = e.target.closest('#back-from-terms-btn'); const backFromAboutBtn = e.target.closest('#back-from-about-btn'); const backFromContactBtn = e.target.closest('#back-from-contact-btn'); const backFromDisclaimerBtn = e.target.closest('#back-from-disclaimer-btn'); const backFromCookieBtn = e.target.closest('#back-from-cookie-btn'); const backFromDMCABtn = e.target.closest('#back-from-dmca-btn'); const backFromFaqBtn = e.target.closest('#back-from-faq-btn'); const backFromAdvertiseBtn = e.target.closest('#back-from-advertise-btn');
        if (openBtn) { e.preventDefault();
            const { toolId, toolName } = openBtn.dataset; if (toolId && toolName) showTool(toolId, toolName, !openBtn.closest('#search-results-view')); 
        }
        if (bookmarkBtn) handleBookmarkClick(bookmarkBtn); 
        if (shareBtn) handleShareClick(shareBtn);
        if (backBtn) { 
            hideTool(); 
            if (currentView === 'your-work') renderYourWorkView(); 
        }
        if (categoryCard) showCategoryTools(categoryCard.dataset.categoryName); 
        if (backToCategoriesBtn) hideCategoryTools();
        if (backFromPrivacyBtn || backFromTermsBtn || backFromAboutBtn || backFromContactBtn || backFromDisclaimerBtn || backFromCookieBtn || backFromDMCABtn || backFromFaqBtn || backFromAdvertiseBtn) {
            switchView(previousView);
        }
        if (currentView === 'your-work') {
            const deleteEventBtn = e.target.closest('.delete-event-btn'); 
            const calendarEvent = e.target.closest('.calendar-event');
            if (e.target.closest('#calendar-today-btn')) { 
                calendarDisplayDate = new Date(); 
                renderYourWorkView(); 
            }
            if (e.target.closest('#calendar-prev-btn')) { 
                calendarDisplayDate.setDate(calendarDisplayDate.getDate() - 7); 
                renderYourWorkView(); 
            }
            if (e.target.closest('#calendar-next-btn')) { 
                calendarDisplayDate.setDate(calendarDisplayDate.getDate() + 7); 
                renderYourWorkView(); 
            }
            if (deleteEventBtn) {
                e.stopPropagation(); 
                const alarmId = deleteEventBtn.dataset.alarmId; 
                const alarm = activeAlarms[alarmId]; 
                const message = (alarm && alarm.frequency !== 'one-time') ? 'Are you sure you want to delete this recurring reminder and all its future occurrences?' : 'Are you sure you want to delete this reminder?';
                if (alarmId && confirm(message)) { 
                    delete activeAlarms[alarmId]; 
                    saveAlarms(); 
                    updateYourWorkBadge(); 
                    renderYourWorkView(); 
                }
            } else if (calendarEvent && !calendarEvent.classList.contains('is-completed')) { 
                const { toolId, toolName } = calendarEvent.dataset; 
                if (toolId && toolName) showTool(toolId, toolName, true); 
            }
        }
    });

    document.body.addEventListener('submit', (e) => { 
        if (e.target.id === 'contact-form') { 
            e.preventDefault(); 
            if (e.target.checkValidity()) { 
                alert('Thank you for your message! We will get back to you shortly.'); 
                e.target.reset(); 
            } 
        } 
    });

    function initializeApp(data) {
        toolsData = data;
        loadAndScheduleAlarms(); 
        updateYourWorkBadge();
        renderTools(popularGrid, toolsData.slice(0, 20), true); 
        renderTools(newGrid, toolsData.slice(20, 40), true);
        document.getElementById('copyright-year').textContent = new Date().getFullYear();
        const mobileBanner = document.getElementById('mobile-top-banner-ad-rotator'); 
        const mainHeader = document.querySelector('.main-header');
        if (mobileBanner && mainHeader && window.getComputedStyle(mobileBanner).display !== 'none') { 
            mainHeader.style.top = '50px'; 
        }
        switchView('home');
    }

    (function() {
        const ad1 = document.querySelector('.ad-1'); const ad2 = document.querySelector('.ad-2'); const ad3 = document.querySelector('.ad-3'); const ad4 = document.querySelector('.ad-4'); const ad5 = document.querySelector('.ad-5'); const ad6 = document.querySelector('.ad-6');
        function restartAnimation(element) { 
            if (!element) return; 
            element.classList.remove('animate'); 
            void element.offsetWidth; 
            element.classList.add('animate'); 
        }
        setInterval(() => restartAnimation(ad1), 55000); 
        setInterval(() => restartAnimation(ad2), 70000); 
        setInterval(() => restartAnimation(ad3), 30000);
        setInterval(() => restartAnimation(ad4), 55000); 
        setInterval(() => restartAnimation(ad5), 70000); 
        setInterval(() => restartAnimation(ad6), 30000);
    })();
    
    const AD_CONFIG = [ { id: 'ad-card-1', intervalSeconds: 20 }, { id: 'ad-card-2', intervalSeconds: 24 }, { id: 'ad-card-3', intervalSeconds: 28 } ];
    function triggerRefresh(adElement) { 
        if (!adElement) return; 
        adElement.classList.add('is-refreshing'); 
        setTimeout(() => { 
            adElement.classList.remove('is-refreshing'); 
        }, 1500); 
    }
    AD_CONFIG.forEach(config => { 
        const adElement = document.getElementById(config.id); 
        if (adElement) { 
            setInterval(() => { 
                triggerRefresh(adElement); 
            }, config.intervalSeconds * 1000); 
        } 
    });

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
            setInterval(rotateBanners, 40000);
        }
    }
    
    // --- START: MOBILE BOTTOM BANNER ROTATION LOGIC ---
    const mobileBottomAds = document.querySelectorAll('.ad-rotator-container .ad-banner');
    if (mobileBottomAds.length > 0) {
        let currentAdIndex = 0;
        const rotationInterval = 30000;
        mobileBottomAds[currentAdIndex].classList.add('active');
        const rotateBottomAds = () => {
            mobileBottomAds[currentAdIndex].classList.remove('active');
            currentAdIndex = (currentAdIndex + 1) % mobileBottomAds.length;
            mobileBottomAds[currentAdIndex].classList.add('active');
        };
        setInterval(rotateBottomAds, rotationInterval);
    }
    // --- END: MOBILE BOTTOM BANNER ROTATION LOGIC ---

    async function loadData() { 
        try { 
            // In a real application, you would fetch a JSON file like this:
            // const response = await fetch('tools.json'); 
            // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); 
            // initializeApp(await response.json()); 
            
            // For this example, we'll use the fallback data directly.
            // In your project, you might want to have a `tools.json` file.
            initializeApp(toolsData_fallback); 
        } catch (error) { 
            console.error("Could not load tools data, using fallback.", error);
            initializeApp(toolsData_fallback); 
        } 
    }
    loadData();
});