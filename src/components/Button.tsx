import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title, className, ...props }) => (
  <TouchableOpacity
    {...props}
    className={`bg-primary px-4 py-2 rounded ${className ?? ''}`}
  >
    <Text className="text-white font-bold">{title}</Text>
  </TouchableOpacity>
);

export default Button;
