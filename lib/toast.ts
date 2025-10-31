export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full max-w-sm`;
  
  // Set colors and icons based on type
  let icon = '';
  switch (type) {
    case 'success':
      toast.className += ' bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-400';
      icon = '✅';
      break;
    case 'error':
      toast.className += ' bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-400';
      icon = '❌';
      break;
    default:
      toast.className += ' bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400';
      icon = 'ℹ️';
  }
  
  // Create content with icon
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-lg">${icon}</span>
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Remove after 4 seconds (longer for better UX)
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}
