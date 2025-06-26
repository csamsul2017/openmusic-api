/* istanbul ignore file */
const { createContainer } = require('instances-container');
// External agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');
const Jwt = require('@hapi/jwt');
// Service (repository, helper, manager etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthRepositoryPostgres = require('./repository/AuthRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('../Infrastructures/security/JwtTokenManager');
// Use case
const AddUserUseCase = require('../Applications/use_case/user/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const AuthRepository = require('../Domains/authentications/AuthRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase');
const TokenManager = require('../Applications/security/TokenManager');
// Creating container
const container = createContainer();
// Registering service and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [{ concrete: pool }],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [{ concrete: bcrypt }],
    },
  },
  {
    key: TokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [{ concrete: Jwt }],
    },
  },
]);

// Registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
]);

// Login use case
container.register([
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
        {
          name: 'tokenManager',
          internal: TokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
