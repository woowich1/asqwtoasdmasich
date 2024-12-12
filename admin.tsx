import React from 'react';
import { createRoot } from 'react-dom/client';
import { Wheel } from './components/wheel';

// Add console logging for debugging
console.log('Admin script loading...');

document.addEventListener('DOMContentLoaded', () => {
    const adminPreviewContainer = document.getElementById('wfw-admin-preview');
    console.log('Container:', adminPreviewContainer);

    if (adminPreviewContainer) {
        const root = createRoot(adminPreviewContainer);
        
        // Log the data we're receiving
        console.log('Admin data:', window.wfwAdminData);
        
        const prizes = window.wfwAdminData?.prizes || [];
        const probabilities = window.wfwAdminData?.probabilities || [];

        root.render(
            <React.StrictMode>
                <div className="wfw-wheel-container">
                    <Wheel 
                        prizes={prizes} 
                        probabilities={probabilities} 
                        onSpin={(prize) => console.log('Won:', prize)} 
                    />
                </div>
            </React.StrictMode>
        );
    } else {
        console.error('Admin preview container not found!');
    }
});

