import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import CustomAlert from '../Alert';
import CustomModal from '../Modal';
import { RegisterModal } from './Register';
import { LoginFormModal } from './Login';

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const LoginModal = ({ visible, onClose }: LoginModalProps) => {
  const { updateUser } = useUser();

  const [showRegister, setShowRegister] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
  });

  return (
    <>
      <CustomModal
        onClose={() => {
          setShowRegister(false);
          onClose();
        }}
        visible={visible}
      >
        {showRegister ? (
          <RegisterModal
            onClose={onClose}
            onBack={() => setShowRegister(false)}
            onRegister={(user) => {
              updateUser(user);
            }}
            onError={(error) => {
              setModalContent({
                title: 'Erro',
                message: error,
              });
              setShowErrorModal(true);
            }}
          ></RegisterModal>
        ) : (
          <LoginFormModal
            onRegister={() => setShowRegister(true)}
            onClose={onClose}
            onAuth={(user) => {
              updateUser(user);
            }}
            onError={(error) => {
              setModalContent({
                title: 'Erro',
                message: error,
              });
              setShowErrorModal(true);
            }}
          ></LoginFormModal>
        )}
      </CustomModal>
      <CustomAlert
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </>
  );
};
