// Notification Handler Module
const NotificationHandler = {
    // Initialize the module
    init() {
        this.setupEventListeners();
        this.createNotificationContainer();
        console.log('NotificationHandler initialized');
    },

    // Set up event listeners
    setupEventListeners() {
        document.addEventListener('notification', (e) => {
            this.showNotification(e.detail.type, e.detail.message);
        });
    },

    // Create notification container
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        document.body.appendChild(container);
    },

    // Show notification
    showNotification(type, message) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            padding: 12px 24px;
            border-radius: 4px;
            background-color: ${this.getBackgroundColor(type)};
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.innerHTML = `
            ${this.getIcon(type)}
            <span>${message}</span>
        `;

        container.appendChild(notification);

        // Remove notification after delay
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    },

    // Helper: Get background color based on type
    getBackgroundColor(type) {
        switch (type) {
            case 'error': return '#dc3545';
            case 'success': return '#28a745';
            case 'warning': return '#ffc107';
            default: return '#17a2b8';
        }
    },

    // Helper: Get icon based on type
    getIcon(type) {
        switch (type) {
            case 'error': return '❌';
            case 'success': return '✅';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => NotificationHandler.init());

// Export for global access
window.NotificationHandler = NotificationHandler; 