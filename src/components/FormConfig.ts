import { FieldConfig } from './FormBuilder';

// Sample login form configuration
export const loginFormConfig: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validationRules: [
      {
        type: 'required',
        message: 'Email is required'
      },
      {
        type: 'email',
        message: 'Please enter a valid email'
      }
    ]
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    validationRules: [
      {
        type: 'required',
        message: 'Password is required'
      },
      {
        type: 'minLength',
        value: 8,
        message: 'Password must be at least 8 characters'
      }
    ]
  },
  {
    name: 'rememberMe',
    label: 'Remember Me',
    type: 'checkbox',
    placeholder: 'Remember me on this device',
    defaultValue: false
  }
];

// Sample registration form configuration
export const registrationFormConfig: FieldConfig[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter your first name',
    validationRules: [
      {
        type: 'required',
        message: 'First name is required'
      }
    ]
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter your last name',
    validationRules: [
      {
        type: 'required',
        message: 'Last name is required'
      }
    ]
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validationRules: [
      {
        type: 'required',
        message: 'Email is required'
      },
      {
        type: 'email',
        message: 'Please enter a valid email'
      }
    ]
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a password',
    validationRules: [
      {
        type: 'required',
        message: 'Password is required'
      },
      {
        type: 'minLength',
        value: 8,
        message: 'Password must be at least 8 characters'
      }
    ]
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    validationRules: [
      {
        type: 'required',
        message: 'Please confirm your password'
      }
    ]
  },
  {
    name: 'userType',
    label: 'User Type',
    type: 'select',
    placeholder: 'Select user type',
    options: [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
      { label: 'Education', value: 'education' }
    ],
    validationRules: [
      {
        type: 'required',
        message: 'Please select a user type'
      }
    ]
  },
  {
    name: 'agreeToTerms',
    label: 'Terms and Conditions',
    type: 'checkbox',
    placeholder: 'I agree to the terms and conditions',
    validationRules: [
      {
        type: 'required',
        message: 'You must agree to the terms and conditions'
      }
    ],
    defaultValue: false
  }
];

// Sample contact form configuration
export const contactFormConfig: FieldConfig[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    validationRules: [
      {
        type: 'required',
        message: 'Name is required'
      }
    ]
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validationRules: [
      {
        type: 'required',
        message: 'Email is required'
      },
      {
        type: 'email',
        message: 'Please enter a valid email'
      }
    ]
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'select',
    options: [
      { label: 'General Inquiry', value: 'general' },
      { label: 'Technical Support', value: 'support' },
      { label: 'Billing Question', value: 'billing' },
      { label: 'Feature Request', value: 'feature' }
    ],
    validationRules: [
      {
        type: 'required',
        message: 'Please select a subject'
      }
    ]
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Enter your message',
    validationRules: [
      {
        type: 'required',
        message: 'Message is required'
      },
      {
        type: 'minLength',
        value: 10,
        message: 'Message must be at least 10 characters'
      }
    ]
  },
  {
    name: 'priority',
    label: 'Priority',
    type: 'radio',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' }
    ],
    validationRules: [
      {
        type: 'required',
        message: 'Please select a priority'
      }
    ]
  }
]; 