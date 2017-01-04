import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export const dbSetupTest = () => {
  if (!mongoose.connection.readyState) {
    mongoose.connect('mongodb://localhost:27000/test');
  }

  const db = mongoose.connection;

  // eslint-disable-next-line no-console
  db.on('error', console.error.bind(console, 'connection error:'));
  db.on('open', () => {
  });
};

export const dbSetup = () => {
  if (!mongoose.connection.readyState) {
    mongoose.connect('mongodb://localhost:27000/prod');
  }

  const db = mongoose.connection;

  // eslint-disable-next-line no-console
  db.on('error', console.error.bind(console, 'connection error:'));
  db.on('open', () => {
    // eslint-disable-next-line no-console
    console.info('connected');
  });
};

export const dbReset = () => {
  if (mongoose.connection.db) {
    mongoose.connection.db.dropDatabase();
  }
};

export const dbClose = () => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  dbReset();
  if (mongoose.connection.readyState) {
    mongoose.disconnect();
  }
};
