import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { WmUser } from '../data/models/WmUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthProps = {
  token: string;
  user: WmUser;
};

type UserContextProps = {
  activeUser?: AuthProps;
  updateUser: (auth?: AuthProps) => void;
};

export const UserContext = createContext<UserContextProps>({
  activeUser: undefined,
  updateUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeUser, setActiveUser] = useState<AuthProps>();

  const updateUser = useCallback(
    (auth?: AuthProps) => {
      if (auth) {
        setActiveUser(auth);
        AsyncStorage.setItem('activeUser', JSON.stringify(auth));
      } else {
        setActiveUser(undefined);
        AsyncStorage.removeItem('activeUser');
      }
    },
    [activeUser]
  );

  useEffect(() => {
    const initialVerification = async () => {
      const user = await AsyncStorage.getItem('activeUser');

      if (user) {
        setActiveUser(JSON.parse(user) as AuthProps);
      }
    };

    initialVerification();
  }, []);

  return (
    <UserContext.Provider value={{ activeUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

UserProvider.displayName = 'UserProvider';
