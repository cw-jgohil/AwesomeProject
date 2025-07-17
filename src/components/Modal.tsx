import React from 'react';
import { Modal as RNModal, View, Text, ModalProps } from 'react-native';

const Modal: React.FC<ModalProps> = props => (
  <RNModal {...props}>
    <View>
      <Text>Modal Content</Text>
    </View>
  </RNModal>
);

export default Modal;
