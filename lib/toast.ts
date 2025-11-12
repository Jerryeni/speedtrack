export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());

  // Create toast element
  const toast = document.createElement('div');
  // Responsive positioning: full width on mobile, fixed width on desktop
  toast.className = `toast-notification fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[9999] px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full sm:max-w-md min-h-[48px]`;
  
  // Set colors and icons based on type
  let icon = '';
  let duration = 5000; // Default 5 seconds
  
  switch (type) {
    case 'success':
      toast.className += ' bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400';
      icon = '✅';
      duration = 4000;
      break;
    case 'error':
      toast.className += ' bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400';
      icon = '❌';
      duration = 6000; // Longer for errors so users can read
      break;
    case 'warning':
      toast.className += ' bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-2 border-yellow-400';
      icon = '⚠️';
      duration = 5000;
      break;
    default:
      toast.className += ' bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-400';
      icon = 'ℹ️';
      duration = 4000;
  }
  
  // Create content with icon and close button
  toast.innerHTML = `
    <div class="flex items-start space-x-2 sm:space-x-3">
      <span class="text-lg sm:text-xl flex-shrink-0 mt-0.5">${icon}</span>
      <span class="font-medium text-sm leading-relaxed flex-1">${message}</span>
      <button class="toast-close flex-shrink-0 ml-1 sm:ml-2 text-white/80 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 sm:-mr-1" aria-label="Close">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Add close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };
  
  if (closeBtn) {
    closeBtn.addEventListener('click', removeToast);
  }
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Auto-remove after duration
  setTimeout(removeToast, duration);
}

// Helper function for success messages
export function showSuccess(message: string) {
  showToast(message, 'success');
}

// Helper function for error messages
export function showError(message: string) {
  showToast(message, 'error');
}

// Helper function for info messages
export function showInfo(message: string) {
  showToast(message, 'info');
}

// Helper function for warning messages
export function showWarning(message: string) {
  showToast(message, 'warning');
}
