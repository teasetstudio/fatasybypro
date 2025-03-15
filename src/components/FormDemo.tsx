import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

import FormBuilder from './FormBuilder';
import { loginFormConfig, registrationFormConfig, contactFormConfig } from './FormConfig';

const FormDemo: React.FC = () => {
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setFormData(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dynamic Form Builder Demo</h1>
      
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white shadow text-blue-700' 
              : 'text-blue-400 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }>
            Login Form
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white shadow text-blue-700' 
              : 'text-blue-400 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }>
            Registration Form
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white shadow text-blue-700' 
              : 'text-blue-400 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }>
            Contact Form
          </Tab>
        </TabList>
        
        <TabPanels className="mt-2">
          <TabPanel className="rounded-xl bg-white p-6 shadow-md">
            <FormBuilder
              title="Login"
              fields={loginFormConfig} 
              onSubmit={handleSubmit} 
              submitButtonText="Log In" 
            />
          </TabPanel>
          
          <TabPanel className="rounded-xl bg-white p-6 shadow-md">
            <FormBuilder
              title="Create an Account"
              fields={registrationFormConfig} 
              onSubmit={handleSubmit} 
              submitButtonText="Register" 
            />
          </TabPanel>
          
          <TabPanel className="rounded-xl bg-white p-6 shadow-md">
            <FormBuilder
              title="Contact Us"
              fields={contactFormConfig} 
              onSubmit={handleSubmit} 
              submitButtonText="Send Message" 
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      
      {formData && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Form Submission Data:</h3>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FormDemo; 