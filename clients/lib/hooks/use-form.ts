import { useState } from 'react';

interface EventLike {
  target: {
    name: string;
    value: any;
  }
}

interface Props {
  validation: Record<string, Function>;
  onSubmit: (e: unknown) => void;
}

export default function useForm({ validation, onSubmit }: Props) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function onChange(e: EventLike) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    if (isFormSubmitted) {
      setErrors({
        ...errors,
        [name]: validation[name]?.(value),
      });
    }
  }

  function hasErrors() {
    const newErrors: Record<string, string> = {};
    Object.keys(validation).forEach(
      (key) => (newErrors[key] = validation[key](form[key] || ''))
    );
    setErrors(newErrors);
    return Object.keys(validation).some((key) => newErrors[key]);
  }

  function _onSubmit(e: unknown) {
    const ev = e as Event || {};
    ev.preventDefault && ev.preventDefault();
    setIsFormSubmitted(true);
    if (!hasErrors()) {
      onSubmit(e);
    }
  }

  return { form, errors, onSubmit: _onSubmit, onChange };
}
