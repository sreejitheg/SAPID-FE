import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { DynamicForm as FormType } from '../../types';
import { createUnifiedService } from '../../demo/demoService';

interface DynamicFormProps {
  form: FormType;
}

export function DynamicForm({ form }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const service = createUnifiedService(true); // Use demo service for now
      await service.submitForm(form.id, formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="text-green-800 dark:text-green-300">
          <h3 className="font-medium">Form Submitted Successfully</h3>
          <p className="text-sm mt-1">Your {form.title.toLowerCase()} has been submitted for processing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{form.title}</h3>
        {form.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{form.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {form.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' ? (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={(e) => handleInputChange(field.name, e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-gray-900 dark:focus:ring-white"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{field.label}</span>
              </label>
            ) : null}
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : (form.submitLabel || 'Submit')}
          </button>
        </div>
      </form>
    </div>
  );
}