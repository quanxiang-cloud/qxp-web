import React, { useEffect, useRef } from 'react';

export interface NameInput {
  name: string;
  onCancel: () => void;
  onChange: (newName: string) => void;
}
export default function NameInput({ name, onCancel, onChange }: NameInput): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  function handleEnterKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Escape' && !e.nativeEvent.isComposing) {
      onCancel();
      return;
    }

    if (e.key !== 'Enter') {
      return;
    }

    const newName = ref.current?.value.trim().slice(0, 50);
    if (!newName || newName === name) {
      onCancel();
      return;
    }

    onChange(newName);
  }

  return (
    <input
      ref={ref}
      type="text"
      defaultValue={name}
      onKeyDown={handleEnterKeyDown}
      placeholder="最长 50 个字符"
    />
  );
}
