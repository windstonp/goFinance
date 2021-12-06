import 
  React,
  {
    createContext,
    ReactNode, 
    useContext,
    useState,
    useEffect
  }
from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode
}

interface User{
  id: string,
  name: string,
  email: string,
  photo?: string,
}

interface AuthContextData{
  user: User,
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  logOut(): Promise<void>;
  userStoragedLoading: boolean;
}

interface AuthorizationResponse{
  params: {
    access_token: string
  },
  type: string
}

function AuthProvider({children}: AuthProviderProps){
  const [user, setUser] = useState<User>({} as User);
  const [userStoragedLoading, setUserStoragedLoading] = useState(true);
  const userDataKey = '@gofinance:user';

  async function signInWithGoogle(){
    try{
      const {CLIENT_ID} = process.env;
      const {REDIRECT_URI} = process.env;
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      
      const authUrl = 
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      
      const {params, type} = await AuthSession.startAsync({authUrl}) as AuthorizationResponse;

      if(type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json();
        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        };
        setUser(userLogged);
        await AsyncStorage.setItem('@gofinance:user', JSON.stringify(userLogged));
      }
    }catch(error){
      throw new Error(error);
      
    }
  }

  async function signInWithApple(){
    try{
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL

        ]
      });
      if(credentials){
        const name = credentials.fullName?.givenName!;
        const photo =  `https://ui-avatars.com/api/?name=${credentials.fullName?.givenName}&length=1`;
        const userLogged = {
          id: String(credentials.user),
          email: credentials.email!,
          name,
          photo
        };
        setUser(userLogged);
        await AsyncStorage.setItem(userDataKey, JSON.stringify(userLogged));
      }
    }catch(error){
      throw new Error(error);
    }
  }

  async function logOut(){
    await AsyncStorage.removeItem(userDataKey);
    setUser({} as User);
  }

  useEffect(()=>{
    async function loadUserInAsyncStorage()
    {
      const userStoraged = await AsyncStorage.getItem(userDataKey)
        .then((response) => response ? JSON.parse(response) as User : undefined);

      if(userStoraged){
        setUser(userStoraged);
      }
      setUserStoragedLoading(false);
    }
    loadUserInAsyncStorage();
  }, []);
  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithGoogle,
      signInWithApple,
      logOut,
      userStoragedLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext);
  return context;
}

export {AuthProvider, useAuth}