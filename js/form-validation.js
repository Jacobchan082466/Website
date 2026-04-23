/* ============================================
   Form Validation & Submission Handler
   ============================================ */

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.originalButtonText = this.submitButton?.textContent || 'Send Message';
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    // Add real-time validation
    this.form.addEventListener('input', (e) => this.validateField(e.target));
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add custom styling for validation states
    this.addValidationStyles();
  }

  validateField(field) {
    const fieldContainer = field.closest('.form-group');
    const errorElement = fieldContainer?.querySelector('.field-error') || this.createErrorElement(fieldContainer);
    
    let isValid = true;
    let errorMessage = '';

    // Remove previous validation state
    field.classList.remove('field-valid', 'field-invalid');
    errorElement.textContent = '';

    // Validate based on field type and attributes
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = this.getRequiredMessage(field);
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Apply validation state
    if (field.value.trim()) {
      field.classList.add(isValid ? 'field-valid' : 'field-invalid');
    }
    
    // Always show error message if validation failed (regardless of field content)
    if (!isValid) {
      field.classList.add('field-invalid');
      errorElement.textContent = errorMessage;
    } else if (field.value.trim()) {
      // Only show valid state if field has content and is valid
      errorElement.textContent = '';
    }

    return isValid;
  }

  createErrorElement(container) {
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    container.appendChild(errorElement);
    return errorElement;
  }

  getRequiredMessage(field) {
    const label = field.closest('.form-group')?.querySelector('.form-label')?.textContent || 'This field';
    return `${label} is required`;
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate entire form
    if (!this.validateForm()) {
      this.showMessage('Please fix the errors above', 'error');
      return;
    }

    // Show loading state
    this.setSubmitState('loading');

    // Collect form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm(data);
      
      // Show success state
      this.setSubmitState('success');
      this.showMessage('Thank you for your message! We will get back to you soon.', 'success');
      this.form.reset();
      
      // Reset form validation states
      setTimeout(() => {
        this.clearValidationStates();
        this.setSubmitState('default');
      }, 3000);

    } catch (error) {
      // Show error state
      this.setSubmitState('error');
      this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
      
      setTimeout(() => {
        this.setSubmitState('default');
      }, 3000);
    }
  }

  async submitForm(data) {
    // Simulate API call - replace with actual form submission logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        console.log('Form data:', data);
        resolve({ success: true });
      }, 1500);
    });
  }

  setSubmitState(state) {
    if (!this.submitButton) return;

    this.submitButton.disabled = state !== 'default';
    
    const states = {
      default: this.originalButtonText,
      loading: 'Sending...',
      success: 'Message Sent!',
      error: 'Failed to Send'
    };

    this.submitButton.textContent = states[state] || states.default;
    this.submitButton.className = `btn btn--primary btn--${state}`;
  }

  showMessage(message, type) {
    // Remove existing message
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    
    // Insert after submit button
    this.submitButton.parentNode.insertBefore(messageElement, this.submitButton.nextSibling);

    // Auto-remove success messages
    if (type === 'success') {
      setTimeout(() => {
        messageElement.remove();
      }, 5000);
    }
  }

  clearValidationStates() {
    const fields = this.form.querySelectorAll('.field-valid, .field-invalid');
    fields.forEach(field => {
      field.classList.remove('field-valid', 'field-invalid');
    });
    
    const errors = this.form.querySelectorAll('.field-error');
    errors.forEach(error => {
      error.textContent = '';
    });
  }

  addValidationStyles() {
    // Add CSS for validation states if not already present
    if (document.querySelector('#form-validation-styles')) return;

    const style = document.createElement('style');
    style.id = 'form-validation-styles';
    style.textContent = `
      .field-valid {
        border-color: #22c55e !important;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1) !important;
      }
      
      .field-invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
      
      .field-error {
        display: block;
        color: #ef4444;
        font-size: var(--fs-caption);
        margin-top: 0.25rem;
        font-weight: var(--fw-medium);
      }
      
      .form-message {
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-top: var(--space-md);
        font-size: var(--fs-small);
        font-weight: var(--fw-medium);
      }
      
      .form-message--success {
        background: rgba(34, 197, 94, 0.1);
        color: #15803d;
        border: 1px solid rgba(34, 197, 94, 0.2);
      }
      
      .form-message--error {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }
      
      .btn--loading {
        opacity: 0.7;
        cursor: not-allowed;
        position: relative;
      }
      
      .btn--loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
      }
      
      .btn--success {
        background: linear-gradient(135deg, #22c55e, #16a34a) !important;
      }
      
      .btn--error {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
      }
      
      @keyframes spin {
        from { transform: translateY(-50%) rotate(0deg); }
        to { transform: translateY(-50%) rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize contact form validator
  new FormValidator('#contact-form');
});