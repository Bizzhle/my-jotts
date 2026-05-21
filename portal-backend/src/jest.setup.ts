jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => (_target: any, _key: string, descriptor: PropertyDescriptor) => descriptor,
  TransactionHost: jest.fn(),
  ClsPluginTransactional: jest.fn().mockImplementation(() => ({})),
}));
