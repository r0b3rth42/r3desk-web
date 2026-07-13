export interface SelectOption {
    label: string;
    value: any;
  }
  
  export interface FormField {
  
    key: string;
  
    label: string;
  
    type:
      | 'text'
      | 'email'
      | 'number'
      | 'textarea'
      | 'select';
  
    required?: boolean;
  
    placeholder?: string;
  
    options?: SelectOption[];
  }