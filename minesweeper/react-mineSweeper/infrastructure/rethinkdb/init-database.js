const rethinkdb = require('rethinkdb');

const RETHINKDB_PORT = 28015;
const HOST = 'localhost';

const DATABASE_NAME = 'minesweeper';
const SCORES_TABLE_NAME = 'scores';
const USERS_TABLE_NAME = 'users';


const initDatabase = async () => {
  // init connection to database
  const connection = await rethinkdb.connect({ host: HOST, port: RETHINKDB_PORT});
  console.log('connection established');

  //check if database already exists
  const databaseExists = await rethinkdb.dbList().contains(DATABASE_NAME).run(connection);
  if (databaseExists) {
    console.log(`database ${DATABASE_NAME} already exists. We will delete it first`);
    await rethinkdb.dbDrop(DATABASE_NAME).run(connection);
    console.log(`database ${DATABASE_NAME} deleted`);
  } else{
    console.log(`database ${DATABASE_NAME} does not exist yey. We will create it`);
  } 
  
  // create database
  await rethinkdb.dbCreate(DATABASE_NAME).run(connection);
  console.log(`database ${DATABASE_NAME} created`);

  // create table users
  await rethinkdb.db(DATABASE_NAME).tableCreate(USERS_TABLE_NAME).run(connection);
  console.log(`table ${USERS_TABLE_NAME} created`);

  // create table scores
  await rethinkdb.db(DATABASE_NAME).tableCreate(SCORES_TABLE_NAME).run(connection);
  console.log(`table ${SCORES_TABLE_NAME} created`);

  // create secondary index on table users, on field email
  await rethinkdb.db(DATABASE_NAME).table(USERS_TABLE_NAME).indexCreate('email').run(connection);
  console.log(`index created on table ${USERS_TABLE_NAME} on field "email"`);

  console.log('init database success');
  process.exit();
}

initDatabase();