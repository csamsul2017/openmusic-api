/* istanbul ignore file */
const { createContainer } = require('instances-container');
// External agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');
// Service (repository, helper, manager etc)
