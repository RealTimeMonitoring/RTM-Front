import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { WmUser } from '../data/models/WmUser';

export type AuthProps = {
  token: string;
  user: WmUser;
};

type UserContextProps = {
  activeUser?: WmUser;
  updateUser: (auth: AuthProps) => void;
};

export const UserContext = createContext<UserContextProps>({
  activeUser: undefined,
  updateUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeUser, setActiveUser] = useState<WmUser>();

  const updateUser = useCallback((auth: AuthProps) => {
    if (auth) {
      setActiveUser(auth.user);
      localStorage.setItem('activeUser', JSON.stringify(auth));
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('activeUser');

    console.log(user);

    if (user) {
      setActiveUser(JSON.parse(user)['user']);
    }
  }, []);

  return (
    <UserContext.Provider value={{ activeUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

UserProvider.displayName = 'UserProvider';
