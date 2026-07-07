import { act, create } from 'react-test-renderer';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './AuthContext';

const mockGetToken = jest.fn();
const mockSetToken = jest.fn();
const mockRemoveToken = jest.fn();

jest.mock('../utils/storage', () => ({
  getToken: (...args: unknown[]) => mockGetToken(...args),
  setToken: (...args: unknown[]) => mockSetToken(...args),
  removeToken: (...args: unknown[]) => mockRemoveToken(...args),
}));

function TestComponent() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  return (
    <>
      <Text testID="loading">{isLoading ? 'loading' : 'ready'}</Text>
      <Text testID="authenticated">{isAuthenticated ? 'true' : 'false'}</Text>
      <Text testID="login" onPress={() => login('test@example.com', 'password')}>
        Login
      </Text>
      <Text testID="logout" onPress={logout}>
        Logout
      </Text>
    </>
  );
}

async function flushPromises() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('restores authentication state from stored token', async () => {
    mockGetToken.mockResolvedValue('mock-token');

    let root!: ReturnType<typeof create>;
    await act(async () => {
      root = create(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await flushPromises();

    const findByTestId = (testID: string) =>
      root.root.findByProps({ testID }).props.children;

    expect(findByTestId('loading')).toBe('ready');
    expect(findByTestId('authenticated')).toBe('true');
  });

  it('starts unauthenticated when no token is stored', async () => {
    mockGetToken.mockResolvedValue(null);

    let root!: ReturnType<typeof create>;
    await act(async () => {
      root = create(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await flushPromises();

    const findByTestId = (testID: string) =>
      root.root.findByProps({ testID }).props.children;

    expect(findByTestId('loading')).toBe('ready');
    expect(findByTestId('authenticated')).toBe('false');
  });

  it('login stores a mock token and authenticates the user', async () => {
    mockGetToken.mockResolvedValue(null);
    mockSetToken.mockResolvedValue(undefined);

    let root!: ReturnType<typeof create>;
    await act(async () => {
      root = create(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await flushPromises();

    const loginNode = root.root.findByProps({ testID: 'login' });

    await act(async () => {
      loginNode.props.onPress();
    });

    await flushPromises();

    const findByTestId = (testID: string) =>
      root.root.findByProps({ testID }).props.children;

    expect(findByTestId('authenticated')).toBe('true');
    expect(mockSetToken).toHaveBeenCalledWith('mock-token');
  });

  it('logout removes the token and clears authentication', async () => {
    mockGetToken.mockResolvedValue('mock-token');
    mockRemoveToken.mockResolvedValue(undefined);

    let root!: ReturnType<typeof create>;
    await act(async () => {
      root = create(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await flushPromises();

    const logoutNode = root.root.findByProps({ testID: 'logout' });

    await act(async () => {
      logoutNode.props.onPress();
    });

    await flushPromises();

    const findByTestId = (testID: string) =>
      root.root.findByProps({ testID }).props.children;

    expect(findByTestId('authenticated')).toBe('false');
    expect(mockRemoveToken).toHaveBeenCalled();
  });
});
