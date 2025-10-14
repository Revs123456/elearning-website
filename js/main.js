// This file is now primarily used by dashboard.html
// The main functionality has been moved to dashboard.html for better organization

// Export functions for use in dashboard.html if needed
window.DashboardUtils = {
    // Utility functions can be added here if needed
    formatDate: function(date) {
        return new Date(date).toLocaleDateString();
    },
    
    formatTime: function(date) {
        return new Date(date).toLocaleTimeString();
    }
};
