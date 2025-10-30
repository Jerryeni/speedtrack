export function showToast(message: string) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-4 left-4 right-4 bg-gradient-to-r from-neon-blue to-electric-purple rounded-xl p-4 text-center font-medium z-50 transform translate-y-full transition-transform text-dark-primary";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateY(0)";
  }, 100);

  setTimeout(() => {
    toast.style.transform = "translateY(100%)";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
