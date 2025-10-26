document.addEventListener('DOMContentLoaded', () => {
    
    // Get the logged-in user's name
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = '/'; // Not logged in, go to login
        return;
    }
    
    // --- These are our theme-related styles from DiceBear API ---
    // Using popular avatar styles from the API
    const avatarStyles = [
        { name: 'Initials', style: 'initials' },
        { name: 'Adventurer', style: 'adventurer' },
        { name: 'Avataaars', style: 'avataaars' },
        { name: 'Bottts', style: 'bottts-neutral' },
        { name: 'Croodles', style: 'croodles' },
        { name: 'Fun-emoji', style: 'fun-emoji' },
        { name: 'Icons', style: 'icons' },
        { name: 'Lorelei', style: 'lorelei' },
        { name: 'Micah', style: 'micah' },
        { name: 'Miniavs', style: 'miniavs' },
        { name: 'Notionists', style: 'notionists' },
        { name: 'Pixel Art', style: 'pixel-art-neutral' },
        { name: 'Shapes', style: 'shapes' },
        { name: 'Thumbs', style: 'thumbs' }
    ];
    
    const picker = document.getElementById('avatarPicker');
    const saveBtn = document.getElementById('saveAvatar');
    let selectedStyle = 'initials'; // Default

    // Create the avatar options on the page
    avatarStyles.forEach((avatarInfo, index) => {
        const option = document.createElement('div');
        option.classList.add('avatar-option');
        if (index === 0) {
            option.classList.add('selected'); // Make first one selected by default
        }
        option.dataset.style = avatarInfo.style; // Store the style name
        
        // Generate the preview image URL
        const img = document.createElement('img');
        img.src = `https://api.dicebear.com/8.x/${avatarInfo.style}/svg?seed=${username}`;
        img.alt = avatarInfo.name;
        
        const name = document.createElement('p');
        name.className = 'avatar-name';
        name.textContent = avatarInfo.name;
        
        option.appendChild(img);
        option.appendChild(name);
        
        if (index === 0) {
            // Add selected badge to first option
            const badge = document.createElement('div');
            badge.className = 'selected-badge';
            badge.textContent = '✓';
            option.appendChild(badge);
        }
        
        picker.appendChild(option);
        
        // Add click listener
        option.addEventListener('click', () => {
            // Remove 'selected' from all others
            picker.querySelectorAll('.avatar-option').forEach(el => {
                el.classList.remove('selected');
                // Remove any existing badges
                const existingBadge = el.querySelector('.selected-badge');
                if (existingBadge) existingBadge.remove();
            });
            // Add 'selected' to this one
            option.classList.add('selected');
            selectedStyle = avatarInfo.style;
            
            // Add badge to selected option
            const badge = document.createElement('div');
            badge.className = 'selected-badge';
            badge.textContent = '✓';
            option.appendChild(badge);
        });
    });

    // Save button logic
    saveBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/update-avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, style: selectedStyle })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Avatar saved! Redirecting to dashboard.');
                window.location.href = '/dashboard';
            } else {
                alert('Error saving avatar.');
            }
        } catch (error) {
            console.error('Save avatar error:', error);
        }
    });
});