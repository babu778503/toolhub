// ⛔️ REMOVE the old createToolViewerHTML function. We will build it dynamically now.

// 🔄 MODIFIED: showTool now moves pre-cached content instead of creating an iframe.
const showTool = (toolId, toolName, saveHistory = true) => {
    const toolContent = document.getElementById(`cache-${toolId}`);
    if (!toolContent) {
        alert('Sorry, this tool could not be loaded. It may not exist.');
        return;
    }

    // Build the viewer shell
    toolViewerContainer.innerHTML = `
        <div class="container">
            <div class="sub-view-header">
                <button id="back-to-tools-btn" class="btn-back" aria-label="Go back"><i class="fas fa-arrow-left"></i></button>
                <div class="reminder-controls-desktop">
                     <input type="datetime-local" id="reminderInput">
                     <select id="reminderFrequencyDesktop">
                        <option value="one-time">One time</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
                     </select>
                     <button id="setReminderBtn">My Work & Set Reminder</button>
                </div>
                <button class="add-event-mobile-btn" title="Add Event" aria-label="Add event or reminder"><i class="fas fa-calendar-plus"></i></button>
            </div>
            <div class="tool-viewer-content" id="tool-viewer-content-area">
                <!-- Tool content will be moved here -->
            </div>
        </div>`;

    // Move the pre-cached tool content into the visible viewer
    const contentArea = document.getElementById('tool-viewer-content-area');
    contentArea.appendChild(toolContent);

    document.body.classList.add('tool-view-active');
    mainContentWrapper.style.display = 'none';
    toolViewerContainer.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (saveHistory) {
        history.pushState({ toolId: toolId }, toolName, `/tool/${toolId}`);
    }

    const reminderInput = document.getElementById('reminderInput');
    const setReminderBtn = document.getElementById('setReminderBtn');
    const frequencySelect = document.getElementById('reminderFrequencyDesktop');
    const addEventMobileBtn = document.querySelector('.add-event-mobile-btn');
    const handleReminderSet = () => {
        if (!reminderInput.value) { if (window.getComputedStyle(setReminderBtn).display !== 'none') { alert('Pick a date & time first'); } return; }
        const when = new Date(reminderInput.value); if (isNaN(when.getTime()) || when <= new Date()) { alert('Choose a future date/time'); reminderInput.value = ''; return; }
        setAlarmWithDate(toolId, toolName, when, frequencySelect.value); alert('Reminder set for ' + when.toLocaleString()); reminderInput.value = '';
    };

    setReminderBtn.addEventListener('click', handleReminderSet);
    if (addEventMobileBtn) { addEventMobileBtn.addEventListener('click', () => { showDatePickerModal(toolId, toolName); }); }
    if (saveHistory) addRecentTool(toolId);
};

// 🔄 MODIFIED: hideTool now moves the tool content back to the cache for reuse.
const hideTool = (updateHistory = true) => {
    if (toolViewerContainer.style.display !== 'none') {
        // Find the tool content that's currently being shown
        const contentArea = document.getElementById('tool-viewer-content-area');
        if (contentArea && contentArea.firstChild) {
            const toolContent = contentArea.firstChild;
            // Move it back to the hidden cache
            const toolCacheContainer = document.getElementById('tool-content-cache');
            toolCacheContainer.appendChild(toolContent);
        }

        document.body.classList.remove('tool-view-active');
        toolViewerContainer.style.display = 'none';
        toolViewerContainer.innerHTML = '';
        mainContentWrapper.style.display = 'block';
        if (updateHistory) {
            history.pushState({ view: currentView }, '', '/');
        }
    }
};
