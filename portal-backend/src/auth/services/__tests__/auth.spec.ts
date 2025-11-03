import { auth } from '../../../../auth';

jest.mock('../../../../auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
    },
  },
}));

describe('User Auth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign up a user', async () => {
    (auth.api.signUpEmail as unknown as jest.Mock).mockResolvedValue({
      user: { id: '1', email: 'test@test.com' },
      session: { token: 'abc123' },
    });

    const result = await auth.api.signUpEmail({
      body: {
        email: 'test@test.com',
        password: 'password',
        name: 'test',
      },
    });

    expect(result.user.email).toBe('test@test.com');
    expect(auth.api.signUpEmail).toHaveBeenCalledWith({
      body: {
        email: 'test@test.com',
        password: 'password',
        name: 'test',
      },
    });
  });

  it('should sign in a user', async () => {
    (auth.api.signInEmail as unknown as jest.Mock).mockResolvedValue({
      user: { id: '1', email: 'test@test.com' },
      session: { token: 'xyz789' },
    });

    const result = await auth.api.signInEmail({
      body: {
        email: 'test@test.com',
        password: 'password',
      },
    });

    expect(result.user.email).toBe('test@test.com');
    expect(auth.api.signInEmail).toHaveBeenCalledWith({
      body: {
        email: 'test@test.com',
        password: 'password',
      },
    });
  });

  it.only('should throw an error on failed registration', async () => {
    (auth.api.signUpEmail as unknown as jest.Mock).mockRejectedValue(
      new Error('Email already exists'),
    );
    const service = auth.api.signUpEmail({
      body: {
        email: 'test@test.com',
        password: 'password',
        name: 'test',
      },
    });

    await expect(service).rejects.toThrow('Email already exists');
  });
});
